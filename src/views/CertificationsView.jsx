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
  Search,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function CertificationsView({ onDataChanged, onNavigate }) {
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
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload certificate' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (certId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await api.certifications.delete(certId);
      await loadCertifications();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert('Failed to delete certificate: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified Credential</span>
          </span>
        );
      case 'Pending':
      case 'Pending Verification':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending Audit</span>
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Verification Failed</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            <span>Unable to Verify</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Optional Section • Unlimited Uploads
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                Automated Verification via QR, ID, Credential URL
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Certifications & Credential Verification Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Upload any number of professional certificates from NPTEL, Coursera, Udemy, Google, AWS, Microsoft, Cisco, hackathons, or workshops.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span>Next: Projects & Skills</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Certification</span>
            </button>
          </div>
        </div>

        {statusMessage.text && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-center space-x-2">
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span className="font-semibold">{statusMessage.text}</span>
            </div>
            {onNavigate && statusMessage.type === 'success' && (
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
              >
                <span>Next: Projects & Skills</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Certifications List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Retrieving verified credential vaults...</span>
        </div>
      ) : certs.length === 0 ? (
        <div className="p-10 bg-white border border-dashed border-slate-300 rounded-2xl text-center space-y-3 shadow-xs">
          <Award className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="text-sm text-slate-800 font-semibold">No Certifications Uploaded Yet</div>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Certifications are optional. You can add Coursera, NPTEL, AWS, Google, or hackathon credentials at any time.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center space-x-1.5 shadow-xs cursor-pointer"
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
              className="p-5 bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs rounded-2xl flex flex-col justify-between transition-all shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {c.name}
                  </h3>
                  {getStatusBadge(c.status)}
                </div>

                <div className="text-xs text-blue-700 font-semibold mb-3 flex items-center space-x-1">
                  <span>{c.issuer || 'Issuing Organization'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-200">
                  {c.certificateId && (
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">Cert ID:</span>
                      <span className="text-slate-800 font-semibold">{c.certificateId}</span>
                    </div>
                  )}
                  {c.issueDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Issued:</span>
                      <span className="text-slate-800">{c.issueDate}</span>
                    </div>
                  )}
                  {c.score && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Score / Grade:</span>
                      <span className="text-emerald-700 font-semibold">{c.score}</span>
                    </div>
                  )}
                  {c.credentialUrl && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Credential URL:</span>
                      <a 
                        href={c.credentialUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 hover:underline flex items-center space-x-0.5 truncate max-w-[140px] font-medium"
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
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions & Evidence Viewer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedCertForEvidence(c)}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audit Evidence</span>
                </button>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-bold">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="text-base text-slate-900">Upload & Verify New Certificate</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCertificate} className="space-y-4 text-xs">
              
              {/* File Upload Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Certificate Document (PDF or Image)
                </label>
                <label className="flex flex-col items-center justify-center p-5 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50 cursor-pointer transition">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-slate-800 font-semibold">
                    {certFile ? certFile.name : 'Click to browse or drop certificate file'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Supports PDF, PNG, JPG</span>
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
                <label className="block text-slate-700 font-semibold mb-1.5 flex items-center justify-between">
                  <span>Certificate QR Code Image (Optional)</span>
                  <span className="text-[10px] text-slate-400 font-normal">For automated cryptographic verification</span>
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Certificate / Course Name</label>
                  <input
                    type="text"
                    name="name"
                    value={certForm.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Deep Learning Specialization"
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    name="issuer"
                    value={certForm.issuer}
                    onChange={handleInputChange}
                    placeholder="e.g. Coursera / DeepLearning.AI / NPTEL"
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Certificate ID</label>
                  <input
                    type="text"
                    name="certificateId"
                    value={certForm.certificateId}
                    onChange={handleInputChange}
                    placeholder="e.g. CS-98214-X"
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={certForm.issueDate}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Score / Grade (Optional)</label>
                  <input
                    type="text"
                    name="score"
                    value={certForm.score}
                    onChange={handleInputChange}
                    placeholder="e.g. 96% / Elite + Gold"
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Credential Verification URL</label>
                  <input
                    type="url"
                    name="credentialUrl"
                    value={certForm.credentialUrl}
                    onChange={handleInputChange}
                    placeholder="https://coursera.org/verify/..."
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Associated Skills (Comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={certForm.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. PyTorch, Computer Vision, Neural Networks"
                    className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  {submitting ? (
                    <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base text-slate-900">Verification Evidence Audit</h3>
              </div>
              <button 
                onClick={() => setSelectedCertForEvidence(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs font-mono border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Certificate Name:</span>
                <span className="text-slate-900 font-sans font-semibold">{selectedCertForEvidence.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Issuer Authority:</span>
                <span className="text-blue-700 font-sans font-semibold">{selectedCertForEvidence.issuer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Certificate ID:</span>
                <span className="text-slate-800">{selectedCertForEvidence.certificateId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Status Verification:</span>
                <span className="text-emerald-700 font-sans font-bold">{selectedCertForEvidence.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Method:</span>
                <span className="text-slate-700 font-sans">{selectedCertForEvidence.verificationMethod || 'Authority Match & ID Audit'}</span>
              </div>
            </div>

            {selectedCertForEvidence.verificationEvidence && (
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-slate-700">
                <span className="font-semibold text-blue-900 block mb-1">Audit Trail Log:</span>
                <p className="font-mono text-[11px] text-slate-600 leading-relaxed">
                  {typeof selectedCertForEvidence.verificationEvidence === 'string'
                    ? selectedCertForEvidence.verificationEvidence
                    : JSON.stringify(selectedCertForEvidence.verificationEvidence, null, 2)}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCertForEvidence(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Navigation Footer */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">Step 3 of 10 Completed</span>
          <h4 className="text-sm font-bold text-slate-900">Ready to showcase your projects & competencies?</h4>
          <p className="text-xs text-slate-600">Proceed to Step 4 to catalog your software projects or import directly from GitHub.</p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 4: Projects & Skills</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
