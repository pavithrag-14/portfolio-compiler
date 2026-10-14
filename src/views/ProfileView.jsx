import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building2, 
  Calendar, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Sparkles,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';

export default function ProfileView({ onProfileUpdated, onNavigate }) {
  const { user, profile: authProfile, refreshUser } = useAuth();
  
  // Inputs start clean by default so students are never forced to use dummy data.
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    department: '',
    graduationYear: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    headline: '',
    aboutMe: '',
    avatarUrl: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.profile.get();
      // Only auto-fill if the student has explicitly saved their custom profile previously.
      // Otherwise keep inputs clean and blank, with blurred example hints.
      if (res && res.profile && res.profile.hasCustomSaved) {
        setFormData({
          fullName: res.profile.fullName || '',
          email: res.profile.email || user?.email || '',
          phone: res.profile.phone || '',
          college: res.profile.college || '',
          degree: res.profile.degree || '',
          department: res.profile.department || '',
          graduationYear: res.profile.graduationYear || '',
          location: res.profile.location || '',
          linkedinUrl: res.profile.linkedinUrl || '',
          githubUrl: res.profile.githubUrl || '',
          headline: res.profile.headline || '',
          aboutMe: res.profile.aboutMe || '',
          avatarUrl: res.profile.avatarUrl || ''
        });
      } else {
        // Start completely clean & unfilled
        setFormData({
          fullName: '',
          email: user?.email || '',
          phone: '',
          college: '',
          degree: '',
          department: '',
          graduationYear: '',
          location: '',
          linkedinUrl: '',
          githubUrl: '',
          headline: '',
          aboutMe: '',
          avatarUrl: ''
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setErrorMsg('Could not fetch profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFillExamples = () => {
    setFormData({
      fullName: 'Neshat V.',
      email: user?.email || 'neshat@portfolio.ai',
      phone: '+91 98765 43210',
      college: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science',
      department: 'Computer Science and Engineering',
      graduationYear: '2026',
      location: 'Bangalore, India',
      linkedinUrl: 'https://linkedin.com/in/neshat-demo',
      githubUrl: 'https://github.com/neshat-developer',
      headline: 'Aspiring UI/UX Designer & Full-Stack Developer',
      aboutMe: 'Passionate computer science undergraduate with experience in React, UI/UX architecture, and real-time telemetry.',
      avatarUrl: ''
    });
  };

  const handleClearAll = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      college: '',
      degree: '',
      department: '',
      graduationYear: '',
      location: '',
      linkedinUrl: '',
      githubUrl: '',
      headline: '',
      aboutMe: '',
      avatarUrl: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.profile.update({ ...formData, hasCustomSaved: true });
      setSuccessMsg(`Profile saved successfully! Proceeding to Academic Records in 2s...`);
      if (refreshUser) refreshUser();
      if (onProfileUpdated) onProfileUpdated();
      
      setTimeout(() => {
        if (onNavigate) onNavigate('academics');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading student profile details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md glow-cyan shrink-0">
              <User className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-100">Student Profile Settings</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Clean Form • Example Hints
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Fields are left clean for your real details. Sample data is displayed as mild blurred hints below each field.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('academics')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Next: Academic Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleFillExamples}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1.5 transition"
              title="Quickly fill sample details for testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fill Sample</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center space-x-1 transition"
              title="Clear all fields"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert with Direct Next Step Action */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('academics')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
            >
              <span>Next: Academic Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-6">
        
        {/* 1. Basic Contact Info */}
        <div>
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>1. Contact & Identity</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Neshat V. (or Alex Morgan)
                </span>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  candidate@university.edu
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  +91 98765 43210
                </span>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Location (City, Country)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter city, state or country..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Bangalore, India
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Academic Details */}
        <div className="pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>2. College & University Education</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* College */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                College / University
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college or university name..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  National Institute of Technology
                </span>
              </div>
            </div>

            {/* Degree Program */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Degree Program
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="Enter degree program..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  B.Tech in Computer Science
                </span>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Department / Major
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department or major..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
              />
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Computer Science and Engineering
                </span>
              </div>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Graduation Year
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2026"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  2026
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Professional Profiles */}
        <div className="pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>3. Links & Headline</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <LinkedinIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="Paste your LinkedIn URL..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  https://linkedin.com/in/yourname
                </span>
              </div>
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                GitHub Profile URL
              </label>
              <div className="relative">
                <GithubIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="Paste your GitHub URL..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  https://github.com/yourusername
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Short Professional Headline
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Enter professional headline..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
              />
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Aspiring UI/UX Designer & Full-Stack Developer
                </span>
              </div>
            </div>

            {/* About Me */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                About Me (Bio)
              </label>
              <textarea
                name="aboutMe"
                rows={4}
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="Write a brief bio about your interests, technical goals, and background..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
              />
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Example:</span>
                <span className="text-slate-400/80 italic blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Passionate computer science undergraduate with experience in React, UI/UX architecture, and real-time telemetry.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {onNavigate ? (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs flex items-center space-x-1.5 transition border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          ) : <div />}

          <div className="flex items-center space-x-2.5">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center space-x-2 transition shadow-md glow-cyan disabled:opacity-50"
            >
              {saving ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Profile</span>
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('academics')}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
              >
                <span>Next: Academic Records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </form>

      {/* Workflow Navigation Footer */}
      <div className="p-5 bg-slate-900/80 border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">Step 1 of 10 Completed</span>
          <h4 className="text-sm font-bold text-slate-100">Ready to upload semester marksheets?</h4>
          <p className="text-xs text-slate-400">Proceed to Step 2 to upload transcript PDFs and calculate independent CGPA.</p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('academics')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-md glow-cyan shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 2: Academic Records</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
