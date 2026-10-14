import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  Award, 
  Mic 
} from 'lucide-react';

export default function AtsResumeModal({ isOpen, onClose, studentData }) {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef(null);

  if (!isOpen) return null;

  const {
    fullName = 'Neshat V.',
    targetRole = 'UI/UX Designer',
    email = 'neshat@example.com',
    phone = '+1 (555) 234-5678',
    location = 'Bangalore, India',
    college = 'National Institute of Technology',
    degree = 'B.Tech in Computer Science and Engineering',
    graduationYear = '2026',
    cgpa = 8.85,
    academicVerification = 'Academic Records Verified',
    linkedinUrl = 'https://linkedin.com/in/neshat-demo',
    githubUrl = 'https://github.com/neshat-demo',
    skills = [],
    projects = [],
    assessmentScore = 80,
    assessmentTopic = 'UI/UX Design',
    interviewScore = 92,
    interviewPace = 135
  } = studentData || {};

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
${fullName.toUpperCase()}
${targetRole} | ${email} | ${phone} | ${location}
LinkedIn: ${linkedinUrl} | GitHub: ${githubUrl}

EDUCATION
${college}
${degree} (${graduationYear})
Cumulative GPA: ${cgpa} / 10.00 (${academicVerification})

VERIFIED TECHNICAL SKILLS
${(skills.length > 0 ? skills : [
  { name: 'React.js', proficiency: 90 },
  { name: 'TypeScript', proficiency: 85 },
  { name: 'Tailwind CSS', proficiency: 92 },
  { name: 'UI/UX Design & Figma', proficiency: 88 },
  { name: 'REST APIs & Node.js', proficiency: 80 }
]).map(s => `• ${s.name} (${s.proficiency || 85}%)`).join('\n')}

TECHNICAL PROJECTS
${(projects.length > 0 ? projects : [
  {
    title: 'Autonomous Drone Flight Telemetry Controller',
    technologies: ['React', 'FastAPI', 'WebSockets'],
    description: 'Real-time telemetry dashboard streaming low-latency drone sensor feeds with failover recovery.'
  },
  {
    title: 'Design System & Component Library',
    technologies: ['Figma', 'TypeScript', 'Tailwind CSS'],
    description: 'WCAG 2.1 AAA accessible atomic tokens and responsive interactive component primitives.'
  }
]).map(p => `• ${p.title} [${Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies || 'React'}]\n  ${p.description || 'Full stack web application.'}`).join('\n\n')}

STANDARDIZED ASSESSMENTS & INTERVIEW EVALUATION
• Calibrated 50-MCQ Topic Assessment (${assessmentTopic}): ${assessmentScore}% Proficiency
• AI Technical & Acoustic Mock Interview: Score ${interviewScore}%, Conversational Pace ${interviewPace} WPM (Optimal)
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Print-only CSS rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #ats-resume-printable, #ats-resume-printable * {
            visibility: visible;
          }
          #ats-resume-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-cyan-500/30 p-6 md:p-8 shadow-2xl max-h-[92vh] flex flex-col space-y-4">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 no-print">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>Verified 1-Page ATS Resume</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-mono">
                  Recruiter Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Auto-compiled from verified academic records, 50-MCQ testing, and interview metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Text!' : 'Copy Plaintext'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm glow-cyan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable ATS Document (High-Contrast Clean White Aesthetic for Print/ATS) */}
        <div className="overflow-y-auto flex-1 pr-1">
          <div 
            id="ats-resume-printable" 
            ref={printRef}
            className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-5 font-sans"
          >
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                {fullName}
              </h1>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {targetRole}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2 font-mono">
                <span>{email}</span>
                <span>•</span>
                <span>{phone}</span>
                <span>•</span>
                <span>{location}</span>
                <span>•</span>
                <span className="text-blue-600 underline">{linkedinUrl}</span>
                <span>•</span>
                <span className="text-blue-600 underline">{githubUrl}</span>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center justify-between">
                <span>Education & Academic Credentials</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded font-mono font-bold">
                  ✓ Verified Transcripts
                </span>
              </h2>
              <div className="flex justify-between items-baseline text-xs">
                <div>
                  <strong className="font-bold text-slate-950">{college}</strong>
                  <div className="text-slate-700">{degree}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-950 font-mono">CGPA: {cgpa} / 10.0</span>
                  <div className="text-slate-600 text-[11px]">Class of {graduationYear}</div>
                </div>
              </div>
            </div>

            {/* Verified Skills */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                Verified Technical Proficiencies
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(skills.length > 0 ? skills : [
                  { name: 'React & Front-End Architecture', proficiency: 90 },
                  { name: 'TypeScript & JavaScript (ES6+)', proficiency: 88 },
                  { name: 'UI/UX Design Systems & Figma', proficiency: 85 },
                  { name: 'REST APIs & Node.js Express', proficiency: 82 },
                  { name: 'Data Structures & Algorithms', proficiency: 80 },
                  { name: 'Tailwind CSS & Web Accessibility', proficiency: 92 }
                ]).map((s, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-100 pb-1 text-slate-800">
                    <span>{s.name}</span>
                    <span className="font-bold text-slate-950 font-mono">{s.proficiency || 85}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                Featured Technical Projects
              </h2>
              <div className="space-y-2.5 text-xs">
                {(projects.length > 0 ? projects : [
                  {
                    title: 'Autonomous Drone Flight Telemetry Controller',
                    technologies: ['React', 'FastAPI', 'WebSockets', 'Tailwind CSS'],
                    description: 'Architected real-time telemetry dashboard processing concurrent sensor feeds with sub-25ms latency and automated failover error-recovery states.'
                  },
                  {
                    title: 'Responsive Design System & Component Library',
                    technologies: ['Figma', 'TypeScript', 'Tailwind CSS', 'WCAG 2.1'],
                    description: 'Engineered high-contrast accessible atomic tokens conforming to WCAG 2.1 AAA standards with fluid responsive breakpoints across 12 viewports.'
                  }
                ]).map((p, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <strong className="font-bold text-slate-950">{p.title}</strong>
                      <span className="text-[11px] font-mono text-slate-600">
                        {Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies || 'React, Node.js'}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Standardized Assessments & Interview Analytics */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                Cognitive Testing & Communication Analytics
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-600">50-MCQ Topic Assessment ({assessmentTopic})</div>
                  <div className="text-base font-black text-slate-950 font-mono mt-0.5">Score: {assessmentScore}%</div>
                  <div className="text-[10px] text-slate-500">15 Easy • 25 Medium • 10 Hard (Calibrated)</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-600">AI Acoustic Mock Interview</div>
                  <div className="text-base font-black text-slate-950 font-mono mt-0.5">Rating: {interviewScore}% (Pace: {interviewPace} WPM)</div>
                  <div className="text-[10px] text-slate-500">Evaluated on clarity, vocal pauses, and system design</div>
                </div>
              </div>
            </div>

            {/* Verification Footer Note */}
            <div className="text-center pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
              Compiled and certified by Portfolio Compiler Intelligence Engine • Verify live at {window.location.origin}/portfolio/{fullName.toLowerCase().replace(/\s+/g, '-')}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
