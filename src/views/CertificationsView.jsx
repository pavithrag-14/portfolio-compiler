import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Award, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  QrCode, 
  ShieldCheck, 
  FileText, 
  X, 
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';

export default function CertificationsView({ onDataChanged }) {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCertForEvidence, setSelectedCertForEvidence] = useState(null);

  // New Certificate Form State - Note: starts completely empty with clean inputs!
  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    certificateId: '',
    issueDate: '',
    expiryDate: '',
    score: '',
    credentialUrl: '',
    skills: ''
  });
  const [certFile, setCertFile] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    setLoading(true);
    try {
      const data = await api.certifications.getAll();
      setCerts(data.certificates || []);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCertForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    if (!certForm.name.trim() && !certFile) {
      setStatusMessage({ type: 'error', text: 'Please provide either a certificate name or upload a document.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      if (certFile) formData.append('certificate', certFile);
      if (qrFile) formData.append('qrCode', qrFile);

      formData.append('name', certForm.name.trim());
      formData.append('issuer', certForm.issuer.trim());
      formData.append('certificateId', certForm.certificateId.trim());
      formData.append('issueDate', certForm.issueDate.trim());
      formData.append('expiryDate', certForm.expiryDate.trim());
      formData.append('score', certForm.score.trim());
      formData.append('credentialUrl', certForm.credentialUrl.trim());
      formData.append('skills', certForm.skills.trim());

      const res = await api.certifications.upload(formData);
      setStatusMessage({ 
        type: 'success', 
        text: `Certificate added! Status: ${res.certificate?.status || 'Pending Verification'}` 
      });

      // Reset form clean
      setCertForm({
        name: '',
        issuer: '',
        certificateId: '',
        issueDate: '',
        expiryDate: '',
        score: '',
        credentialUrl: '',
        skills: ''
      });
      setCertFile(null);
      setQrFile(null);
      setIsAddModalOpen(false);

      await loadCertifications();
      if (onDataChanged) onDataChanged();
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload certificate' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (certId) => {
    if (!window.confirm('Are you sure you want to remove this certificate?')) return;
    try {
      await api.certifications.delete(certId);
      await loadCertifications();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Verified</span>
          </span>
        );
      case 'Pending Verification':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Pending Verification</span>
          </span>
        );
      case 'Verification Failed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span>Verification Failed</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            <span>Unable to Verify</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Optional Section • Unlimited Uploads
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Automated Verification via QR, ID, Credential URL
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Certifications & Credential Verification Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Upload any number of professional certificates from NPTEL, Coursera, Udemy, Google, AWS, Microsoft, Cisco, hackathons, or workshops.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-md glow-teal shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Certification</span>
          </button>
        </div>

        {statusMessage.text && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200' 
              : 'bg-red-950/40 border border-red-500/40 text-red-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Certifications List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Retrieving verified credential vaults...</span>
        </div>
      ) : certs.length === 0 ? (
        <div className="p-10 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl text-center space-y-3">
          <Award className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm text-slate-300 font-medium">No Certifications Uploaded Yet</div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Certifications are optional. You can add Coursera, NPTEL, AWS, Google, or hackathon credentials at any time.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Your First Certificate</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((c) => (
            <div 
              key={c.id}
              className="p-5 bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 rounded-2xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-2">
                    {c.name}
                  </h3>
                  {getStatusBadge(c.status)}
                </div>

                <div className="text-xs text-cyan-400 font-semibold mb-3 flex items-center space-x-1">
                  <span>{c.issuer || 'Issuing Organization'}</span>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl space-y-1.5 text-xs text-slate-400 border border-slate-800/80">
                  {c.certificateId && (
                    <div className="flex justify-between font-mono">
                      <span>Cert ID:</span>
                      <span className="text-slate-200">{c.certificateId}</span>
                    </div>
                  )}
                  {c.issueDate && (
                    <div className="flex justify-between">
                      <span>Issued:</span>
                      <span className="text-slate-300">{c.issueDate}</span>
                    </div>
                  )}
                  {c.score && (
                    <div className="flex justify-between">
                      <span>Score / Grade:</span>
                      <span className="text-emerald-400 font-semibold">{c.score}</span>
                    </div>
                  )}
                  {c.credentialUrl && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                      <span>Credential URL:</span>
                      <a 
                        href={c.credentialUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-cyan-400 hover:underline flex items-center space-x-0.5 truncate max-w-[140px]"
                      >
                        <span className="truncate">Verify Link</span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Skills tags extracted */}
                {c.skillsVerified && c.skillsVerified.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.skillsVerified.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/60 border border-cyan-500/20 text-cyan-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions & Evidence Viewer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedCertForEvidence(c)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audit Evidence</span>
                </button>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-slate-500 hover:text-red-400 transition p-1"
                  title="Delete certificate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Certificate Modal - clean inputs, no random dummy text */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <Award className="w-5 h-5" />
                <h3 className="text-base text-slate-100">Upload & Verify New Certificate</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCertificate} className="space-y-4 text-xs">
              
              {/* File Upload Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Certificate Document (PDF or Image)
                </label>
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 hover:border-amber-400 rounded-xl bg-slate-950 cursor-pointer transition">
                  <Upload className="w-6 h-6 text-slate-500 mb-1" />
                  <span className="text-slate-300 font-semibold">
                    {certFile ? certFile.name : 'Click to browse or drop certificate file'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Supports PDF, PNG, JPG</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* QR Code Upload (Optional) */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                  <span>Certificate QR Code Image (Optional)</span>
                  <span className="text-[10px] text-slate-500">For automated cryptographic verification</span>
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Certificate / Course Name</label>
                  <input
                    type="text"
                    name="name"
                    value={certForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Deep Learning Specialization"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-slate-100 placeholder:text-slate-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    name="issuer"
                    value={certForm.issuer}
                    onChange={handleInputChange}
                    placeholder="e.g. Coursera / DeepLearning.AI / NPTEL"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-slate-100 placeholder:text-slate-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Certificate ID</label>
                  <input
                    type="text"
                    name="certificateId"
                    value={certForm.certificateId}
                    onChange={handleInputChange}
                    placeholder="e.g. CS-98214-X"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-slate-100 placeholder:text-slate-600 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={certForm.issueDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Score / Grade (Optional)</label>
                  <input
                    type="text"
                    name="score"
                    value={certForm.score}
                    onChange={handleInputChange}
                    placeholder="e.g. 96% / Elite + Gold"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-slate-100 placeholder:text-slate-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Credential Verification URL</label>
                  <input
                    type="url"
                    name="credentialUrl"
                    value={certForm.credentialUrl}
                    onChange={handleInputChange}
                    placeholder="https://coursera.org/verify/..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-slate-100 placeholder:text-slate-600 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1">Associated Skills (Comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={certForm.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. PyTorch, Computer Vision, Neural Networks"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-slate-100 placeholder:text-slate-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center space-x-1.5 shadow-md"
                >
                  {submitting ? (
                    <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                  <span>Upload & Verify</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Evidence Audit Inspection Modal */}
      {selectedCertForEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-base text-slate-100">Verification Evidence Audit</h3>
              </div>
              <button 
                onClick={() => setSelectedCertForEvidence(null)}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl space-y-2 text-xs font-mono border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Certificate Name:</span>
                <span className="text-slate-200">{selectedCertForEvidence.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issuer Authority:</span>
                <span className="text-cyan-400">{selectedCertForEvidence.issuer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Certificate ID:</span>
                <span className="text-slate-200">{selectedCertForEvidence.certificateId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Verification:</span>
                <span className="text-emerald-400 font-bold">{selectedCertForEvidence.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="text-slate-300">{selectedCertForEvidence.verificationMethod || 'Authority Match & ID Audit'}</span>
              </div>
            </div>

            {selectedCertForEvidence.verificationEvidence && (
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-300">
                <span className="font-semibold text-cyan-400 block mb-1">Audit Trail Log:</span>
                <p className="font-mono text-[11px] text-slate-400 leading-relaxed">
                  {typeof selectedCertForEvidence.verificationEvidence === 'string'
                    ? selectedCertForEvidence.verificationEvidence
                    : JSON.stringify(selectedCertForEvidence.verificationEvidence, null, 2)}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCertForEvidence(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
