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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                STEP 01 • ACADEMIC RECORD
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Upload Official Marksheet
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
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
              ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
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
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
                <FileText className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono text-blue-700 font-bold">{selectedFile.name}</span>
              <span className="text-[11px] text-slate-500">Transcripts Loaded • Click to replace file</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to select transcript PDF or marksheet scan
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports semester transcripts, provisional degree, grade reports (PDF, JPG)
                </p>
              </div>
            </div>
          )}

          {isExtractingOcr && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-2 text-blue-700 text-xs font-mono">
              <Cpu className="w-6 h-6 text-blue-600 animate-spin" />
              <span>AI OCR extracting course grades, STEM credits & GPA...</span>
            </div>
          )}
        </div>

        {/* Marksheet Metadata Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cumulative GPA / Percentage
              </label>
              <input
                type="text"
                required
                value={gpaInput}
                onChange={(e) => setGpaInput(e.target.value)}
                placeholder="e.g. 3.92 / 4.0 or 9.4 CGPA"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree & Specialization
              </label>
              <input
                type="text"
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Tech in Computer Science & Engineering"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Verify & Save Transcripts</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
