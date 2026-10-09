import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  FileCheck, 
  Code, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles, 
  Search, 
  KeyRound, 
  Cpu, 
  Fingerprint,
  RefreshCw
} from 'lucide-react';

export default function Step2Verification({ candidateData, onProceed, onOpenCertModal }) {
  const [selectedCertIndex, setSelectedCertIndex] = useState(0);
  const [scanningQR, setScanningQR] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [tamperCheckRunning, setTamperCheckRunning] = useState(false);
  const [tamperStatus, setTamperStatus] = useState("Passed (0 anomalies detected)");

  const handleScanQR = (cert) => {
    setScanningQR(true);
    setScannedResult(null);
    setTimeout(() => {
      setScanningQR(false);
      setScannedResult({
        certTitle: cert.title,
        issuer: cert.issuer,
        hash: cert.signatureHash,
        timestamp: "2025-11-20T14:22:10Z",
        publicKey: "0x892aF...712c",
        status: "VALID_CRYPTOGRAPHIC_SEAL"
      });
    }, 1500);
  };

  const handleRunTamperCheck = () => {
    setTamperCheckRunning(true);
    setTimeout(() => {
      setTamperCheckRunning(false);
      setTamperStatus("Passed (0 anomalies detected across 842 commits and 2 certificates)");
    }, 1400);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Workflow Step 02</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
            <span>Automated Verification Engine</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Zero-knowledge cryptographic validation of credentials, QR hash signatures, and deep codebase originality scraping.
          </p>
        </div>

        {/* Recruiter Trust Score */}
        <div className="glass-panel px-4 py-2.5 rounded-xl border border-emerald-500/30 flex items-center space-x-4 bg-emerald-950/20">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Integrity Trust Score</div>
            <div className="text-lg font-mono font-bold text-slate-100 flex items-center space-x-1.5">
              <span>{candidateData.trustScore}%</span>
              <span className="text-[11px] text-emerald-400 font-normal px-1.5 py-0.2 bg-emerald-500/20 rounded">Grade A+</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Verification Blocks matching diagram: QR Scanner, Certificate Validator, Coding Scrapers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. QR Code Scanner */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">QR Code Scanner</h3>
                  <p className="text-[11px] text-cyan-400 font-mono">Digital Signature Reader</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Active Scanner
              </span>
            </div>

            {/* Interactive Scanner Box */}
            <div className="relative bg-slate-950/80 rounded-xl border border-slate-800 p-4 overflow-hidden mb-4 min-h-[170px] flex flex-col items-center justify-center">
              {scanningQR ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <div className="relative w-28 h-28 border-2 border-dashed border-cyan-400 rounded-lg flex items-center justify-center overflow-hidden">
                    <QrCode className="w-16 h-16 text-cyan-300 opacity-60" />
                    {/* Laser scan line */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce shadow-lg shadow-cyan-400" />
                  </div>
                  <span className="text-xs font-mono text-cyan-300 animate-pulse">Decrypting credential hash...</span>
                </div>
              ) : scannedResult ? (
                <div className="w-full space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Cryptographic Signature Valid!</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                    <div className="text-slate-400 truncate"><span className="text-slate-500">Cert:</span> {scannedResult.certTitle}</div>
                    <div className="text-slate-400 truncate"><span className="text-slate-500">Hash:</span> {scannedResult.hash}</div>
                    <div className="text-slate-400"><span className="text-slate-500">Issuer Key:</span> {scannedResult.publicKey}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="w-16 h-16 mx-auto mb-2 bg-slate-900 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">Verify credentials via QR scanner</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Scans issuer metadata against origin registry</p>
                </div>
              )}
            {candidateData.certificates.length > 1 && (
              <div className="mb-2">
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Select Certificate to Scan:</label>
                <select
                  value={selectedCertIndex}
                  onChange={(e) => setSelectedCertIndex(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-1.5 focus:outline-none"
                >
                  {candidateData.certificates.map((c, i) => (
                    <option key={c.id || i} value={i}>{c.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <button
            onClick={() => handleScanQR(candidateData.certificates[selectedCertIndex] || candidateData.certificates[0])}
            disabled={scanningQR || candidateData.certificates.length === 0}
            className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>{scanningQR ? 'Scanning QR...' : 'Scan & Validate Credential QR'}</span>
          </button>
        </div>

        {/* 2. Certificate Validator */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Certificate Validator</h3>
                  <p className="text-[11px] text-emerald-400 font-mono">Issuer Authenticity Check</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {candidateData.certificates.length} Verified
              </span>
            </div>

            <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
              {candidateData.certificates.map((cert) => (
                <div key={cert.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{cert.title}</h4>
                      <p className="text-[10px] text-slate-400">{cert.issuer} • Issued {cert.issueDate}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cert.skillsVerified.map(skill => (
                      <span key={skill} className="text-[9px] bg-slate-900 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
                    <span>ID: {cert.id}</span>
                    <span className="text-emerald-400">Tamper-Proof</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={onOpenCertModal}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>+ Upload Another Certificate</span>
            </button>
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-2 text-center text-[11px] text-emerald-300">
              Digital Certificate Watermarks verified by Credential Registry
            </div>
          </div>
        </div>

        {/* 3. Coding Scrapers */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">Coding Scrapers</h3>
                  <p className="text-[11px] text-indigo-400 font-mono">AST & Commit Verifier</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Deep Analysis
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Codebase Originality:</span>
                  <span className="font-mono font-bold text-emerald-400">{candidateData.github.originalityScore}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96%' }} />
                </div>
                <p className="text-[10px] text-slate-500">
                  Automated AST scanner confirms non-forked implementations with verified authorship.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">LeetCode Authenticity:</span>
                  <span className="font-mono font-bold text-orange-400">Verified Token</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Contest Rating: <strong className="text-slate-200 font-mono">{candidateData.leetcode.contestRating}</strong></span>
                  <span>Total Solved: <strong className="text-slate-200 font-mono">{candidateData.leetcode.totalSolved}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunTamperCheck}
            disabled={tamperCheckRunning}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${tamperCheckRunning ? 'animate-spin' : ''}`} />
            <span>{tamperCheckRunning ? 'Auditing Commit Trees...' : 'Run Anti-Plagiarism & Tamper Audit'}</span>
          </button>
        </div>

      </div>

      {/* Verification Ledger Summary Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-semibold text-slate-100">Verification Ledger Status: </span>
            <span className="text-emerald-400 font-mono">{tamperStatus}</span>
          </div>
        </div>

        <button
          onClick={onProceed}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs tracking-wide hover:opacity-95 transition-all shadow-lg glow-cyan flex items-center space-x-2 shrink-0"
        >
          <span>Proceed to Skill Gap Engine</span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
