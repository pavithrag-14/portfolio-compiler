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
  RefreshCw
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';

export default function ProfileView({ onProfileUpdated }) {
  const { user, profile: authProfile, refreshUser } = useAuth();
  
  // Note: All state fields start strictly empty or with actual loaded profile data.
  // NO random fake values (like 'John Doe') are pre-populated!
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
      if (res && res.profile) {
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.profile.update(formData);
      setSuccessMsg(`Profile saved successfully! Completion: ${res.completionPercentage}%`);
      if (refreshUser) refreshUser();
      if (onProfileUpdated) onProfileUpdated();
      setTimeout(() => setSuccessMsg(''), 4000);
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
      
      {/* Header */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/20 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md glow-cyan shrink-0">
              <User className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Student Profile Settings</h1>
              <p className="text-xs text-slate-400">
                Personal and academic profile details. Initial registration does not force unnecessary data.
              </p>
            </div>
          </div>
          <button
            onClick={loadProfile}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset / Reload</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
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
        
        {/* Basic Contact Info */}
        <div>
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>1. Contact & Identity</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
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
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

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
                  placeholder="e.g. alex@university.edu"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

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
                  placeholder="e.g. +1 555-0199"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

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
                  placeholder="e.g. San Francisco, CA"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Academic Details */}
        <div className="pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>2. College & University Education</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
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
                  placeholder="e.g. MIT / Anna University"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

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
                  placeholder="e.g. Bachelor of Technology (B.Tech)"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Department / Major
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
              />
            </div>

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
            </div>

          </div>
        </div>

        {/* Professional Profiles */}
        <div className="pt-4 border-t border-slate-800">
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span>3. Links & Headline</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
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
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

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
                  placeholder="https://github.com/username"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Short Professional Headline
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Aspiring Full Stack Engineer | React & Node.js Specialist"
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                About Me (Bio)
              </label>
              <textarea
                name="aboutMe"
                rows={4}
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="Share your technical interests, passion projects, and career aspirations..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none"
              />
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
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
        </div>

      </form>

    </div>
  );
}
