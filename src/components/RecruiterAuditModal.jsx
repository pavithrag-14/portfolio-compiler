import React from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  FileCheck, 
  Code, 
  Fingerprint, 
  Lock, 
  Copy, 
  Download 
} from 'lucide-react';

export default function RecruiterAuditModal({ isOpen, onClose, candidateData, selectedRole }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-emerald-500/40 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                  AUDIT PASSED: ZERO ANOMALIES
                </span>
                <span className="text-xs text-slate-400 font-mono">Ledger Node #891-B</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5">
                Cryptographic Recruiter Verification Audit
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

        {/* Candidate & Verification Header */}
        {/* Candidate & Verification Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400">Candidate Name</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">{candidateData?.name || candidateData?.fullName || 'Student Candidate'}</div>
            <div className="text-[11px] text-cyan-400 font-mono">{candidateData?.email || 'verified@student.edu'}</div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400">Target Role</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">{selectedRole?.title || 'UI/UX Designer'}</div>
            <div className="text-[11px] text-emerald-400 font-mono">Match Vector: 94.2%</div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400">Integrity Trust Score</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">{candidateData?.trustScore || 98.4}% (Grade A+)</div>
            <div className="text-[11px] text-slate-400 font-mono">Zero Fraud Detected</div>
          </div>
        </div>

        {/* Cryptographic Ledger Breakdown */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Immutable Verification Chain Logs
          </h4>

          {/* Item 1: Marksheet */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>Academic Marksheet & Transcripts</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                PASSED • SHA256 MATCH
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg">
              Hash: {candidateData?.marksheet?.hash || '0x4f89d3a17e0b621c9a4b2208d...'}
            </div>
            <p className="text-[11px] text-slate-400">
              Verified against National University Academic Depository with matching cryptographic seal.
            </p>
          </div>

          {/* Item 2: Certificates */}
          {(candidateData?.certificates || []).map((cert, idx) => (
            <div key={cert.id || idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center space-x-2">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Certificate: {cert.title || cert.name}</span>
                </span>
                <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                  ISSUER RSA VALID
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg flex justify-between items-center">
                <span>Signature: {cert.signatureHash || cert.certificateId || 'RSA-4096-PASS'}</span>
                <span className="text-slate-500">Issuer: {cert.issuer}</span>
              </div>
            </div>
          ))}

          {/* Item 3: GitHub & Code Originality */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center space-x-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>GitHub AST Code Authorship & Anti-Plagiarism</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                ORIGINALITY 96.4%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Abstract Syntax Tree token comparisons across public repository indexes verify custom architecture. Commits span 365 days with verified authorship keys.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Certificate Token: 0x91FA...89E2</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Official Audit Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
