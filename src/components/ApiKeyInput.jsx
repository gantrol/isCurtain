'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function ApiKeyInput({ apiKey, setApiKey, useDefaultKey, setUseDefaultKey }) {
  const { t } = useLanguage();
  
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini-api-key');
    if (savedKey) {
      setApiKey(savedKey);
      setUseDefaultKey(false);
    }
  }, [setApiKey, setUseDefaultKey]);

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('gemini-api-key', apiKey);
    }
  };

  return (
    <Card className="p-6 border-2 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <Switch
          id="use-default-key"
          checked={useDefaultKey}
          onCheckedChange={setUseDefaultKey}
        />
        <label htmlFor="use-default-key" className="text-sm cursor-pointer font-medium">
          {t('api.useDefault')}
          <span className="text-xs ml-1 text-muted-foreground">
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {t('api.getKey')}
            </a>
          </span>
        </label>
      </div>

      {!useDefaultKey && (
        <div className="animate-fade-in">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">{t('api.keyLabel')}</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={t('api.keyPlaceholder')}
              className="transition-all duration-300 focus:border-primary"
            />
          </div>

          <Button
            onClick={saveApiKey}
            variant="outline"
            size="sm"
            className="transition-all duration-300 hover:border-primary hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
            {t('api.saveKey')}
          </Button>

          <p className="mt-3 text-xs text-muted-foreground">
            {t('api.privacy')}
          </p>
        </div>
      )}
    </Card>
  );
}
