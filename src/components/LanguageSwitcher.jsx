// components/LanguageSwitcher.jsx
'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:bg-white/90 dark:hover:bg-gray-700/90"
      onClick={toggleLanguage}
      aria-label={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="mr-1"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        <path d="M2 12h20"></path>
      </svg>
      {language === 'zh' ? 'EN' : '中文'}
    </Button>
  );
}
