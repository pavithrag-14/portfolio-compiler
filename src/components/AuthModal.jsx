import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User, 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  X
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, error } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLoginTab) {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both email and password.');
        }
        await login(email.trim(), password);
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => onClose(), 600);
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error('Email and password are required.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        await register(email.trim(), password, fullName.trim());
        setSuccessMsg('Account created successfully!');
        setTimeout(() => onClose(), 600);
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLocalError('');
    setLoading(true);
    try {
      await login('student@portfolio.ai', 'password123');
      setSuccessMsg('Logged in as Student Demo!');
      setTimeout(() => onClose(), 500);
    } catch (err) {
      setLocalError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-xl p-6 relative overflow-hidden">
        {/* Soft background tint */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/60 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center font-bold shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isLoginTab ? 'Student Portal Login' : 'Create Student Account'}
            </h2>
            <p className="text-xs text-slate-500">
              {isLoginTab 
                ? 'Access your employability records and portfolio' 
                : 'Sign up with zero random pre-filled data'}
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100/90 border border-slate-200 rounded-xl mb-5 relative z-10">
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setLocalError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              isLoginTab ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setLocalError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              !isLoginTab ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {(localError || error) && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2 relative z-10">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2 relative z-10">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form - Note: Inputs start completely clean, no random dummy text */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-blue-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.edu"
                className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password <span className="text-blue-600">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl pl-9 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isLoginTab && (
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={async () => {
                    if (!email.trim()) {
                      setLocalError('Please enter your email address to reset password.');
                      return;
                    }
                    try {
                      setLoading(true);
                      const res = await api.auth.forgotPassword(email.trim());
                      setSuccessMsg(res.message || 'Password reset instructions sent. Default temporary password: password123');
                    } catch (err) {
                      setLocalError(err.message || 'Failed to reset password');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium transition"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : isLoginTab ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Student Account</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Option */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center relative z-10">
          <p className="text-[11px] text-slate-500 mb-2">Want to test with the existing sample student profile?</p>
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-700 border border-blue-200/90 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick Sign-In as Sample Student</span>
          </button>
        </div>
      </div>
    </div>
  );
}
