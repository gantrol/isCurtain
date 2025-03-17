'use client';

import { useState, useRef, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ComparisonDisplay } from '@/components/ComparisonDisplay';
import { SimilarityRating } from '@/components/SimilarityRating';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getCurrentLanguage } from '@/lib/i18n/utils';

export default function Home() {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [useDefaultKey, setUseDefaultKey] = useState(true);
  const [originalImage, setOriginalImage] = useState(null);
  const [curtainImage, setCurtainImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 添加引用用于自动滚动
  const resultsRef = useRef(null);
  
  // 图片加载完成后自动滚动到结果区域
  useEffect(() => {
    if (curtainImage && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [curtainImage]);
  
  const handleSubmit = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const base64Image = Buffer.from(bytes).toString('base64');
      setOriginalImage(`data:${file.type};base64,${base64Image}`);
      
      // Prepare form data for transformation API
      const formData = new FormData();
      formData.append('image', file);
      if (!useDefaultKey && apiKey) {
        formData.append('apiKey', apiKey);
      }

      // Call transformation API
      const transformResponse = await fetch('/api/gemini/transform', {
        method: 'POST',
        body: formData,
      });
      
      if (!transformResponse.ok) {
        const errorData = await transformResponse.json();
        throw new Error(errorData.error || 'Transformation failed');
      }
      
      const transformData = await transformResponse.json();
      setCurtainImage(transformData.image);
      
      let curtainBase64 = null;
      if (transformData.image && transformData.image.startsWith('data:')) {
        curtainBase64 = transformData.image.split(',')[1];
      }
      
      const analyzeResponse = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalImage: base64Image,
          curtainImage: transformData.image,
          apiKey: useDefaultKey ? null : apiKey,
          language: getCurrentLanguage(),
        }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analyzeData = await analyzeResponse.json();
      setRating(analyzeData.rating);
      setAnalysis(analyzeData.analysis);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error processing image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <LanguageSwitcher />
      <h1 className="text-4xl font-bold text-center mb-8 text-primary animate-fade-in">
        {t('app.title')}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 animate-slide-up">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('upload.title')}</h2>
          <FileUpload onFileChange={setFile} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('api.title')}</h2>
          <ApiKeyInput 
            apiKey={apiKey} 
            setApiKey={setApiKey}
            useDefaultKey={useDefaultKey}
            setUseDefaultKey={setUseDefaultKey}
          />
        </div>
      </div>
      
      <div className="flex justify-center mb-12">
        <Button 
          size="lg"
          onClick={handleSubmit}
          disabled={!file || isLoading}
          className="relative overflow-hidden group"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">{t('analyze.button')}</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </>
          ) : (
            <>
              {t('analyze.button')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex flex-col items-center py-12 animate-fade-in">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-primary/60 animate-spin"></div>
            </div>
          </div>
          <p className="text-foreground mt-6 font-medium">{t('loading.message')}</p>
          <p className="text-muted-foreground text-sm mt-2">{t('loading.wait')}</p>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-center mb-8 p-6 bg-red-50 rounded-lg border border-red-200 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="font-medium text-lg">{t('error.title')}</p>
          <p className="mt-1">{error}</p>
        </div>
      )}
      
      {curtainImage && (
        <div ref={resultsRef} className="animate-fade-in">
          <ComparisonDisplay 
            originalImage={originalImage} 
            curtainImage={curtainImage} 
          />
          
          <SimilarityRating 
            rating={rating} 
            analysis={analysis} 
          />
        </div>
      )}
    </main>
  );
}
