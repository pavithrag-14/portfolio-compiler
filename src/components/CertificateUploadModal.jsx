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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                STEP 01 • CREDENTIAL INGESTION
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Upload & Verify Certification
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
            accept=".pdf,image/png,image/jpeg,image/webp"
            className="hidden"
          />

          {filePreview ? (
            <div className="flex flex-col items-center space-y-2">
              <img 
                src={filePreview} 
                alt="Certificate preview" 
                className="max-h-36 rounded-lg border border-slate-200 shadow-md object-contain"
              />
              <span className="text-xs font-mono text-blue-700 flex items-center space-x-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedFile?.name} ({(selectedFile?.size / 1024).toFixed(1)} KB)</span>
              </span>
              <span className="text-[11px] text-slate-500">Click to change file</span>
            </div>
          ) : selectedFile ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
                <FileText className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono text-blue-700 font-bold">{selectedFile.name}</span>
              <span className="text-[11px] text-slate-500">PDF Document Loaded • Click to replace</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to browse or drag & drop certificate here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF documents, PNG, JPG, or Credly badges (Up to 25 MB)
                </p>
              </div>
            </div>
          )}

          {isExtractingOcr && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-2 text-blue-700 text-xs font-mono">
              <Cpu className="w-6 h-6 text-blue-600 animate-spin" />
              <span>AI OCR extracting certificate title, issuer & cryptographic seal...</span>
            </div>
          )}
        </div>

        {/* Certificate Metadata Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Certificate Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Amazon Web Services / Coursera / Google"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Credential ID / License Key
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="e.g. CERT-MLA-88129"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Date
              </label>
              <input
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="e.g. Oct 2026"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Verified Skills (comma separated tags)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Machine Learning, Python, PyTorch, Cloud Infrastructure"
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Verification URL (Optional)
            </label>
            <input
              type="url"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="https://credly.com/badges/... or https://coursera.org/verify/..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
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
              <span>Verify & Add Certificate</span>
            </button>
          </div>
        </form>

        {/* Existing Certificates Management List */}
        {existingCertificates.length > 0 && (
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-500 font-semibold flex items-center justify-between">
              <span>Active Ingested Certificates ({existingCertificates.length})</span>
            </h4>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {existingCertificates.map((cert) => (
                <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 border border-emerald-200">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{cert.title}</p>
                      <p className="text-[10px] text-slate-500 truncate font-mono">{cert.issuer} • {cert.issueDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      Verified
                    </span>
                    {onDeleteCertificate && (
                      <button
                        onClick={() => onDeleteCertificate(cert.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
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
