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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFillExamples = () => {
    setFormData({
      fullName: 'Neshat V.',
      email: user?.email || 'neshat.v@portfolio.ai',
      phone: '+91 98765 43210',
      college: 'National Institute of Technology',
      degree: 'Bachelor of Technology',
      department: 'Computer Science and Engineering',
      graduationYear: '2026',
      location: 'Bangalore, India',
      linkedinUrl: 'https://linkedin.com/in/neshat-v',
      githubUrl: 'https://github.com/neshat-v',
      headline: 'Aspiring UI/UX Designer & Frontend Engineer',
      aboutMe: 'Passionate computer science undergraduate with experience in design systems, human-computer interaction, and full-stack development.',
      avatarUrl: ''
    });
    setSuccessMsg('Sample data loaded into fields! Review and click Save Profile when ready.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleClearAll = () => {
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
    setSuccessMsg('All input fields cleared.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Mark as custom saved so future page refreshes recall their filled inputs
      const payload = {
        ...formData,
        hasCustomSaved: true
      };
      await api.profile.update(payload);
      if (refreshUser) await refreshUser();
      if (onProfileUpdated) onProfileUpdated();
      setSuccessMsg('Profile saved successfully! Your records are now synchronized.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading student profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-xs shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">Student Profile Settings</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                  Clean Form • Example Hints
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
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
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('academics')}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span>Next: Academic Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleFillExamples}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
              title="Quickly fill sample details for testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Fill Sample</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center space-x-1 transition border border-slate-200 cursor-pointer"
              title="Clear all fields"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert with Direct Next Step Action */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('academics')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
            >
              <span>Next: Academic Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="p-6 bg-white border border-slate-200/90 rounded-2xl space-y-6 shadow-xs">
        
        {/* 1. Basic Contact Info */}
        <div>
          <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>1. Contact & Identity</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Neshat V. (or Alex Morgan)
                </span>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  candidate@university.edu
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  +91 98765 43210
                </span>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Location (City, Country)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter city, state or country..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Bangalore, India
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Academic Details */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>2. College & University Education</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* College */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                College / University
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college or university name..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  National Institute of Technology
                </span>
              </div>
            </div>

            {/* Degree Program */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Degree Program
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="Enter degree program..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  B.Tech in Computer Science
                </span>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Department / Major
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department or major..."
                className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Computer Science and Engineering
                </span>
              </div>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Graduation Year
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2026"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  2026
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Professional Profiles */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>3. Links & Headline</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <LinkedinIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="Paste your LinkedIn URL..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  https://linkedin.com/in/yourname
                </span>
              </div>
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                GitHub Profile URL
              </label>
              <div className="relative">
                <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="Paste your GitHub URL..."
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  https://github.com/yourusername
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Short Professional Headline
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Enter professional headline..."
                className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Aspiring UI/UX Designer & Full-Stack Developer
                </span>
              </div>
            </div>

            {/* About Me */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                About Me (Bio)
              </label>
              <textarea
                name="aboutMe"
                rows={4}
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="Write a brief bio about your interests, technical goals, and background..."
                className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
              <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-500">Example:</span>
                <span className="text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded blur-[0.6px] hover:blur-none select-none transition-all duration-200 cursor-help" title="Hover to view unblurred text">
                  Passionate computer science undergraduate with experience in React, UI/UX architecture, and real-time telemetry.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {onNavigate ? (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-200 shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          ) : <div />}

          <div className="flex items-center space-x-2.5">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center space-x-2 transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Profile</span>
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('academics')}
                className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
              >
                <span>Next: Academic Records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </form>

      {/* Workflow Navigation Footer */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">Step 1 of 10 Completed</span>
          <h4 className="text-sm font-bold text-slate-900">Ready to upload semester marksheets?</h4>
          <p className="text-xs text-slate-600">Proceed to Step 2 to upload transcript PDFs and calculate independent CGPA.</p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('academics')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-2 transition shadow-xs shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 2: Academic Records</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
