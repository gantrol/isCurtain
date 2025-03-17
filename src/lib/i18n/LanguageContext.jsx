// lib/i18n/LanguageContext.jsx
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from './translations';
import { getCurrentLanguage } from './utils';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('zh');
  
  useEffect(() => {
    // 尝试从localStorage读取保存的语言偏好
    const savedLanguage = getCurrentLanguage();
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // 检测浏览器语言
      const browserLanguage = navigator.language || navigator.userLanguage;
      // 如果浏览器语言不是中文，则设置为英文
      if (!browserLanguage.startsWith('zh')) {
        setLanguage('en');
      }
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
