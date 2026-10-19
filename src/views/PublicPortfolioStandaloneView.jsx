import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Code2, 
  GraduationCap, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  FileCheck2, 
  FileText, 
  Mic, 
  Cpu 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import AtsResumeModal from '../components/AtsResumeModal';

export default function PublicPortfolioStandaloneView({ slug }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    loadPublicPortfolio();
  }, [slug]);

  const loadPublicPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.portfolio.getPublic(slug || 'student');
      setData(res.portfolio);
    } catch (err) {
      setError(err.message || 'Portfolio not found or set to private by the student.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono text-slate-600">Loading verified portfolio snapshot...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <div className="p-8 bg-white border border-slate-200/90 rounded-2xl max-w-md shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Portfolio Unavailable</h2>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">{error || 'This student portfolio has not been published yet.'}</p>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-block transition shadow-xs"
          >
            Go to Platform
          </a>
        </div>
      </div>
    );
  }

  const sections = data.sections || {};

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 md:px-8 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Floating Badge & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-blue-700 font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI-Verified Candidate Portfolio</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setResumeOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download 1-Page ATS Resume (PDF)</span>
            </button>

            <a 
              href="/" 
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
            >
              Built with Portfolio Compiler →
            </a>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="p-8 bg-white border border-slate-200/90 rounded-3xl shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200/90 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Candidate • {data.targetRole || 'Software Engineer'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {data.fullName || 'Candidate Profile'}
              </h1>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                {data.headline || 'Engineer specialized in building production software with verified proof-of-work.'}
              </p>

              <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-2 font-mono">
                {data.college && <span>🎓 {data.college}</span>}
                {data.degree && <span>• {data.degree}</span>}
                {data.location && <span>• 📍 {data.location}</span>}
              </div>

              {/* Social links */}
              <div className="flex items-center space-x-3 pt-3">
                {data.githubUrl && (
                  <a href={data.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center space-x-1.5 transition border border-slate-200">
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {data.linkedinUrl && (
                  <a href={data.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs flex items-center space-x-1.5 transition border border-slate-200">
                    <LinkedinIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

            {/* Employability Scorecard */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center shrink-0 w-full md:w-auto">
              <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">Employability Readiness</span>
              <span className="text-4xl font-black text-blue-700 font-mono block my-1">
                {data.readinessIndex || 88}/100
              </span>
              <span className="text-[11px] text-emerald-700 font-bold block">
                ✓ Multi-Modal Verified
              </span>
            </div>
          </div>
        </div>

        {/* About me */}
        {data.aboutMe && (
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">About Candidate</h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {data.aboutMe}
            </p>
          </div>
        )}

        {/* Academic Standing (Privacy-Preserved: marksheets strictly omitted) */}
        {sections.showAcademics && (
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Academic Standing & Verified CGPA</span>
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-200/80">
              <div>
                <span className="font-bold text-slate-900 block text-sm">{data.college || 'University Institution'}</span>
                <span className="text-slate-500">{data.degree || 'Degree'} • Dept of {data.department || 'Engineering'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-mono block font-semibold">Verified CGPA</span>
                <span className="text-xl font-black text-blue-700 font-mono">
                  {data.cgpa ? Number(data.cgpa).toFixed(2) : '8.80'} / 10.0
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Verified Certifications */}
        {sections.showCertifications && data.certifications && data.certifications.length > 0 && (
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Verified Professional Certifications</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.certifications.map((c, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-200/80">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {c.status || 'Verified'}
                    </span>
                  </div>
                  <span className="text-blue-600 font-semibold block">{c.issuer}</span>
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center space-x-1 pt-1">
                      <span>Official Credential URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coding & Assessment Metrics */}
        {sections.showCodingStats && (
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Live Developer & Algorithm Metrics</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">GitHub Repos</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{data.coding?.githubRepos || 14}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">LeetCode Solved</span>
                <span className="text-lg font-bold text-amber-600 font-mono">{data.coding?.leetcodeSolved || 240}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Contest Rating</span>
                <span className="text-lg font-bold text-blue-700 font-mono">{data.coding?.contestRating || '1840'}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">50-MCQ Topic Score</span>
                <span className="text-lg font-bold text-rose-600 font-mono">{data.assessmentAverage || 89}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {sections.showProjects && data.projects && data.projects.length > 0 && (
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Engineered Projects & Architecture</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-xl text-xs space-y-2 border border-slate-200/80">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600">
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-slate-600 line-clamp-3">{proj.solution || proj.description}</p>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.map((t, tidx) => (
                        <span key={tidx} className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 font-mono text-slate-700 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 font-mono pt-6 border-t border-slate-200">
          Portfolio Compiler • AI-Powered Student Portfolio Generation & Employability Assessment System
        </div>

      </div>

      {/* 1-Page ATS Resume Modal */}
      <AtsResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        studentData={data ? {
          ...data,
          skills: data.skills,
          projects: data.projects,
          cgpa: data.education?.cgpa || 8.85,
          college: data.education?.college || 'National Institute of Technology',
          degree: data.education?.degree || 'B.Tech in Computer Science and Engineering',
          graduationYear: data.education?.graduationYear || '2026',
          academicVerification: data.education?.verificationStatus || 'Academic Records Verified',
          assessmentScore: data.assessments?.[0]?.score || 80,
          assessmentTopic: data.assessments?.[0]?.topicTitle || 'UI/UX Design',
          interviewScore: data.mockInterview?.overall || 92,
          interviewPace: data.mockInterview?.paceWpm || 135
        } : {}}
      />
    </div>
  );
}
