'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function ComparisonDisplay({ originalImage, curtainImage }) {
  const { t } = useLanguage();
  const [activeImage, setActiveImage] = useState(null);
  
  return (
    <div className="mb-12 animate-slide-up">
      <h2 className="text-2xl font-bold text-center mb-8 text-primary">{t('comparison.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
          <CardHeader className="bg-secondary py-3">
            <h3 className="text-center font-medium text-lg">{t('comparison.original')}</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              className="relative h-80 cursor-zoom-in transition-transform duration-300 hover:scale-[1.02]" 
              onClick={() => setActiveImage('original')}
            >
              <Image 
                src={originalImage} 
                alt={t('comparison.original')} 
                fill 
                style={{ objectFit: 'contain' }} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
          <CardHeader className="bg-secondary py-3">
            <h3 className="text-center font-medium text-lg">{t('comparison.curtain')}</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              className="relative h-80 cursor-zoom-in transition-transform duration-300 hover:scale-[1.02]" 
              onClick={() => setActiveImage('curtain')}
            >
              <Image 
                src={curtainImage} 
                alt={t('comparison.curtain')} 
                fill 
                style={{ objectFit: 'contain' }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {activeImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div 
            className="relative w-full max-w-5xl h-[85vh] transform transition-transform duration-300 hover:scale-[1.02]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image 
              src={activeImage === 'original' ? originalImage : curtainImage} 
              alt={activeImage === 'original' ? t('comparison.original') : t('comparison.curtain')} 
              fill 
              style={{ objectFit: 'contain' }} 
              className="rounded-lg"
            />
            <button 
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/30 text-white rounded-full p-2 transition-colors duration-300"
              onClick={() => setActiveImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
