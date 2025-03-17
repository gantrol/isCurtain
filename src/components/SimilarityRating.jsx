'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function SimilarityRating({ rating, analysis }) {
  const { t } = useLanguage();
  const [progressWidth, setProgressWidth] = useState(0);
  
  // 添加打分动画效果
  useEffect(() => {
    if (rating > 0) {
      setProgressWidth(0);
      setTimeout(() => {
        setProgressWidth((rating / 5) * 100);
      }, 300);
    }
  }, [rating]);
  
  return (
    <Card className="mb-12 border-2 shadow-lg animate-slide-up">
      <CardHeader className="bg-secondary">
        <h2 className="text-2xl font-bold text-center text-primary">{t('rating.title')}</h2>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{t('rating.score')}</span>
            <span className="text-lg font-bold text-primary">{t(`ratingLabel.${rating}`)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-primary h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{t('rating.notAtAll')}</span>
            <span>{t('rating.moderately')}</span>
            <span>{t('rating.verySimilar')}</span>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-lg">{t('rating.analysis')}</h3>
          <div className="text-foreground bg-secondary/50 p-5 rounded-lg whitespace-pre-wrap border border-primary/20">
            {analysis}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
