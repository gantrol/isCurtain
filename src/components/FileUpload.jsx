'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function FileUpload({ onFileChange }) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    
    setPreview(URL.createObjectURL(file));
    onFileChange(file);
  };

  return (
    <Card 
      className={`p-6 border-2 border-dashed transition-all duration-300 ease-in-out ${
        isDragging 
        ? 'border-primary bg-primary/10 scale-105' 
        : 'border-gray-300 hover:border-primary/50 hover:bg-primary/5'
      } 
      rounded-lg cursor-pointer flex flex-col items-center justify-center min-h-[200px]`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} 
        className="hidden" 
        accept="image/*" 
      />
      
      {preview ? (
        <div className="relative w-full h-48 mb-4 animate-fade-in">
          <Image src={preview} alt="预览图" fill style={{ objectFit: 'contain' }} />
        </div>
      ) : (
        <div className="text-center animate-pulse-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-primary/70 mb-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-foreground font-medium mb-2">{t('upload.dropText')}</p>
          <p className="text-sm text-muted-foreground">{t('upload.supportText')}</p>
        </div>
      )}
    </Card>
  );
}
