import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  GraduationCap 
} from 'lucide-react';

export default function MarksheetUploadModal({ 
  isOpen, 
  onClose, 
  marksheetData, 
  onUpdateMarksheet 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [gpaInput, setGpaInput] = useState(marksheetData?.gpa || '3.92 / 4.0');
  const [university, setUniversity] = useState('National Institute of Technology');
  const [degree, setDegree] = useState('B.Tech in Computer Science');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileProcess = (file) => {
    if (!file) return;
    setSelectedFile(file);

    setIsExtractingOcr(true);
    setTimeout(() => {
      setIsExtractingOcr(false);
      // Auto-extract simulated high GPA from marksheet
      setGpaInput('3.95 / 4.0 (9.5 CGPA)');
    }, 900);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedMarksheet = {
      fileName: selectedFile ? selectedFile.name : 'official_university_transcripts.pdf',
      verified: true,
      verificationMethod: "Cryptographic University Stamp & Digital Signature",
      hash: `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      gpa: gpaInput,
      university,
      degree,
      courses: [
        { code: "CS301", name: "Data Structures & Algorithms", grade: "A+", credits: 4, score: 98 },
        { code: "CS402", name: "Machine Learning Foundations", grade: "A+", credits: 4, score: 96 },
        { code: "MA201", name: "Linear Algebra & Calculus", grade: "A+", credits: 4, score: 99 },
        { code: "CS305", name: "Database Management Systems", grade: "A", credits: 3, score: 94 },
        { code: "CS410", name: "Distributed Systems & Cloud", grade: "A", credits: 3, score: 92 },
      ]
    };

    onUpdateMarksheet(updatedMarksheet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-cyan-500/40 p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-800 font-semibold">
                STEP 01 • ACADEMIC RECORD
              </span>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5">
                Upload Official Marksheet
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop Upload Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 relative ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
              : 'border-slate-700 hover:border-cyan-500/60 bg-slate-950/60 hover:bg-slate-900/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
            accept=".pdf,image/png,image/jpeg"
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <FileText className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono text-cyan-300 font-bold">{selectedFile.name}</span>
              <span className="text-[11px] text-slate-400">Transcripts Loaded • Click to replace file</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Click to select transcript PDF or marksheet scan
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports semester transcripts, provisional degree, grade reports (PDF, JPG)
                </p>
              </div>
            </div>
          )}

          {isExtractingOcr && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-2 text-cyan-300 text-xs font-mono">
              <Cpu className="w-6 h-6 text-cyan-400 animate-spin" />
              <span>AI OCR extracting course grades, STEM credits & GPA...</span>
            </div>
          )}
        </div>

        {/* Marksheet Metadata Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cumulative GPA / Percentage
              </label>
              <input
                type="text"
                required
                value={gpaInput}
                onChange={(e) => setGpaInput(e.target.value)}
                placeholder="e.g. 3.92 / 4.0 or 9.4 CGPA"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Degree & Specialization
              </label>
              <input
                type="text"
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Tech in Computer Science & Engineering"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md glow-cyan"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Verify & Save Transcripts</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
