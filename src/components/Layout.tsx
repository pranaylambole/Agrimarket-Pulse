import React, { useState } from 'react';
import { Sprout, BarChart3, TrendingUp, Search, Menu, X, Globe, UserCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, Language } from '../data/translations';
import { AuthModal } from './AuthModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'compare', label: t('compare'), icon: TrendingUp },
    { id: 'products', label: t('products'), icon: Sprout },
  ];

  const handleAuthClick = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-earth-50">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab={authTab}
      />

      {/* Header */}
      <header className="bg-white border-b border-earth-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-agri-600 p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-earth-900 hidden sm:block">
                {t('appTitle')}
              </span>
              <span className="text-xl font-bold tracking-tight text-earth-900 sm:hidden">
                AgriMarket
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "border-agri-600 text-agri-700"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === language)?.nativeName}</span>
                </button>

                {isLangMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={cn(
                            "block w-full text-left px-4 py-2 text-sm hover:bg-gray-50",
                            language === lang.code ? "text-agri-600 font-medium" : "text-gray-700"
                          )}
                        >
                          <span className="mr-2">{lang.nativeName}</span>
                          <span className="text-xs text-gray-400">({lang.name})</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="h-6 w-px bg-gray-200" />

              <button 
                onClick={() => handleAuthClick('login')}
                className="text-sm font-medium text-gray-700 hover:text-agri-600"
              >
                {t('login')}
              </button>
              <button 
                onClick={() => handleAuthClick('signup')}
                className="bg-agri-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-agri-700 transition-colors"
              >
                {t('signup')}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 text-gray-600"
              >
                <Globe className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-earth-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-md text-base font-medium",
                    activeTab === item.id
                      ? "bg-agri-50 text-agri-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </div>
                </button>
              ))}
              
              <div className="border-t border-gray-100 my-2 pt-2">
                <button 
                  onClick={() => handleAuthClick('login')}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  {t('login')}
                </button>
                <button 
                  onClick={() => handleAuthClick('signup')}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-agri-600 hover:bg-gray-50"
                >
                  {t('signup')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Language Menu (Overlay) */}
        {isLangMenuOpen && (
          <div className="absolute top-16 right-0 w-full bg-white border-b border-gray-200 shadow-lg md:hidden z-30">
            <div className="grid grid-cols-2 gap-2 p-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLangMenuOpen(false);
                  }}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm text-center border transition-colors",
                    language === lang.code 
                      ? "bg-agri-50 border-agri-200 text-agri-700 font-medium" 
                      : "border-gray-100 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className="text-lg mb-1">{lang.nativeName}</div>
                  <div className="text-xs text-gray-400">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-earth-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} {t('appTitle')}. {t('footer')}
          </p>
        </div>
      </footer>
    </div>
  );
}
