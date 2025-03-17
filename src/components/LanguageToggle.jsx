// components/LanguageToggle.jsx
"use client";

import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
    >
      {language === 'zh' ? '文/EN' : 'ZH/En'}
    </Button>
  );
}
