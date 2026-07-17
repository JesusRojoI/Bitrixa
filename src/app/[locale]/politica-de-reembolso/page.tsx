'use client';
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

const PoliticaReembolsoPage = () => {
  const t = useTranslations('refunds');
  const locale = useLocale();

  return (
    <main className="bg-gray-100 min-h-screen">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
            <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">Home</a>
            <span>/</span>
            <span className="text-orange-400">{t('title')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">{t('title')}</h1>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-gray-200 space-y-10">
            {t.raw('sections')?.map((section: any, i: number) => (
              <div key={i}>
                <h2 className="text-2xl font-black text-gray-900 mb-4">{section.title}</h2>
                {section.content && (
                  <p className="text-gray-700 font-bold leading-relaxed mb-4">{section.content}</p>
                )}
                {section.items && (
                  <ul className="space-y-2 ml-4">
                    {section.items.map((item: string, j: number) => (
                      <li key={j} className="text-gray-700 font-bold flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.numberedItems && (
                  <ol className="space-y-3 ml-4 list-decimal">
                    {section.numberedItems.map((item: string, j: number) => (
                      <li key={j} className="text-gray-700 font-bold leading-relaxed">{item}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}

            {/* Footer legal */}
            <div className="border-t border-gray-200 pt-8 text-center">
              <p className="text-gray-700 font-bold mb-2">{t('guarantee')}</p>
              <p className="text-gray-600 font-medium text-sm">{t('address')}</p>
              <p className="text-gray-600 font-medium text-sm">{t('phone')}</p>
              <a href="mailto:informacion@bitrixa.com.mx" className="text-orange-500 font-bold hover:underline text-sm">
                informacion@bitrixa.com.mx
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PoliticaReembolsoPage;