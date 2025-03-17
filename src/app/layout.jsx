import "./globals.css";
import { Inter } from "next/font/google";
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: '这衣服像窗帘吗？',
  description: '利用Gemini AI判断衣服是否像窗帘',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
