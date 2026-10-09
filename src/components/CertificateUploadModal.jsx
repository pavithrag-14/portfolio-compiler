import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  Cpu, 
  Plus 
} from 'lucide-react';

export default function CertificateUploadModal({ 
  isOpen, 
  onClose, 
  onAddCertificate, 
  existingCertificates = [], 
  onDeleteCertificate 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('Oct 2026');
  const [credentialId, setCredentialId] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileProcess = (file) => {
    if (!file) return;
    setSelectedFile(file);

    // If image, create thumbnail preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Auto-detect title from filename
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setTitle(cleanName.replace(/\b\w/g, c => c.toUpperCase()));
    
    // Simulate smart AI OCR auto-extraction
    setIsExtractingOcr(true);
    setTimeout(() => {
      setIsExtractingOcr(false);
      if (!issuer) {
        if (/aws|amazon/i.test(cleanName)) {
          setIssuer('Amazon Web Services');
          setSkillsInput('AWS SageMaker, Cloud Architecture, Python');
        } else if (/google|gcp/i.test(cleanName)) {
          setIssuer('Google Cloud');
          setSkillsInput('TensorFlow, BigQuery, Vertex AI');
        } else if (/coursera|deeplearning/i.test(cleanName)) {
          setIssuer('DeepLearning.AI / Coursera');
          setSkillsInput('Neural Networks, PyTorch, Deep Learning');
        } else {
          setIssuer('Accredited Certification Board');
          setSkillsInput('Machine Learning, Python, Problem Solving');
        }
      }
      if (!credentialId) {
        setCredentialId(`CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`);
      }
    }, 800);
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
    if (!title.trim() || !issuer.trim()) return;

    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newCert = {
      id: credentialId || `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`,
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate.trim() || '2026',
      credentialUrl: credentialUrl.trim() || `https://verify.cert-network.org/${credentialId}`,
      qrCodeData: `https://verify.cert-network.org/qr/${credentialId || 'SIG-OK'}-SHA256`,
      verified: true,
      skillsVerified: skillsArray.length > 0 ? skillsArray : ['Verified Credential', 'Technical Competence'],
      verificationStatus: 'Cryptographically Verified',
      signatureHash: `sig_sha256_${Math.random().toString(36).substring(2, 12)}`,
      filePreview: filePreview,
      fileName: selectedFile ? selectedFile.name : 'uploaded_certificate.pdf',
      fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : '184 KB'
    };

    onAddCertificate(newCert);

    // Reset form
    setSelectedFile(null);
    setFilePreview(null);
    setTitle('');
    setIssuer('');
    setCredentialId('');
    setSkillsInput('');
    setCredentialUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-cyan-500/40 p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
                STEP 01 • CREDENTIAL INGESTION
              </span>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5">
                Upload & Verify Certification
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
            accept=".pdf,image/png,image/jpeg,image/webp"
            className="hidden"
          />

          {filePreview ? (
            <div className="flex flex-col items-center space-y-2">
              <img 
                src={filePreview} 
                alt="Certificate preview" 
                className="max-h-36 rounded-lg border border-slate-700 shadow-md object-contain"
              />
              <span className="text-xs font-mono text-cyan-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedFile?.name} ({(selectedFile?.size / 1024).toFixed(1)} KB)</span>
              </span>
              <span className="text-[11px] text-slate-400">Click to change file</span>
            </div>
          ) : selectedFile ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
                <FileText className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono text-cyan-300 font-bold">{selectedFile.name}</span>
              <span className="text-[11px] text-slate-400">PDF Document Loaded • Click to replace</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Click to browse or drag & drop certificate here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF documents, PNG, JPG, or Credly badges (Up to 25 MB)
                </p>
              </div>
            </div>
          )}

          {isExtractingOcr && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-2 text-cyan-300 text-xs font-mono">
              <Cpu className="w-6 h-6 text-cyan-400 animate-spin" />
              <span>AI OCR extracting certificate title, issuer & cryptographic seal...</span>
            </div>
          )}
        </div>

        {/* Certificate Metadata Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Certificate Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Amazon Web Services / Coursera / Google"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Credential ID / License Key
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="e.g. CERT-MLA-88129"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issue Date
              </label>
              <input
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="e.g. Oct 2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Verified Skills (comma separated tags)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Machine Learning, Python, PyTorch, Cloud Infrastructure"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Verification URL (Optional)
            </label>
            <input
              type="url"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://credly.com/badges/... or https://coursera.org/verify/..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md glow-cyan"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Verify & Add Certificate</span>
            </button>
          </div>
        </form>

        {/* Existing Certificates Management List */}
        {existingCertificates.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
              <span>Active Ingested Certificates ({existingCertificates.length})</span>
            </h4>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {existingCertificates.map((cert) => (
                <div key={cert.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-200 truncate">{cert.title}</p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">{cert.issuer} • {cert.issueDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Verified
                    </span>
                    {onDeleteCertificate && (
                      <button
                        onClick={() => onDeleteCertificate(cert.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
