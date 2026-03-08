import React, { useState } from 'react';
import { X, User, Mail, Lock, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { t } = useLanguage();
  const { signup, login } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [role, setRole] = useState<'farmer' | 'trader'>('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
  };

  const switchTab = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
      }
    }

    setLoading(true);
    try {
      if (activeTab === 'signup') {
        await signup(email, password, name.trim(), role);
      } else {
        await login(email, password);
      }
      resetForm();
      onClose();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      setError(getFirebaseErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-agri-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold">
            {activeTab === 'login' ? t('loginTitle') : t('signupTitle')}
          </h2>
          <p className="text-agri-100 mt-1 text-sm">
            {activeTab === 'login'
              ? t('welcomeDesc').split(',')[0]
              : t('footer')}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
            <button
              onClick={() => switchTab('login')}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                activeTab === 'login'
                  ? 'bg-white text-agri-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t('login')}
            </button>
            <button
              onClick={() => switchTab('signup')}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                activeTab === 'signup'
                  ? 'bg-white text-agri-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t('signup')}
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <>
                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('role')}</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        checked={role === 'farmer'}
                        onChange={() => setRole('farmer')}
                        className="text-agri-600 focus:ring-agri-500"
                      />
                      <span className="text-sm text-gray-700">{t('farmer')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        checked={role === 'trader'}
                        onChange={() => setRole('trader')}
                        className="text-agri-600 focus:ring-agri-500"
                      />
                      <span className="text-sm text-gray-700">{t('trader')}</span>
                    </label>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-500"
                      placeholder={t('fullName')}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-500"
                  placeholder={t('email')}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password (signup only) */}
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">{t('confirmPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-agri-600 text-white py-2.5 rounded-lg font-medium hover:bg-agri-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {activeTab === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                <>
                  {activeTab === 'login' ? t('submitLogin') : t('submitSignup')}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {activeTab === 'login' ? (
              <>
                {t('noAccount')}{' '}
                <button
                  onClick={() => switchTab('signup')}
                  className="text-agri-600 font-medium hover:underline"
                >
                  {t('signup')}
                </button>
              </>
            ) : (
              <>
                {t('haveAccount')}{' '}
                <button
                  onClick={() => switchTab('login')}
                  className="text-agri-600 font-medium hover:underline"
                >
                  {t('login')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
