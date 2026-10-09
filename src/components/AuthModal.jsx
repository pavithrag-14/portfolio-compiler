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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0b1220] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md glow-cyan shrink-0">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {isLoginTab ? 'Student Portal Login' : 'Create Student Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {isLoginTab 
                ? 'Access your employability records and portfolio' 
                : 'Sign up with zero random pre-filled data'}
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-900/80 border border-slate-800 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setLocalError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              isLoginTab ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setLocalError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              !isLoginTab ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {(localError || error) && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form - Note: Inputs start completely clean, no random dummy text */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.edu"
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-10 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
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
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-md glow-cyan flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
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
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400 mb-2">Want to test with the existing sample student profile?</p>
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Sign-In as Sample Student</span>
          </button>
        </div>
      </div>
    </div>
  );
}
