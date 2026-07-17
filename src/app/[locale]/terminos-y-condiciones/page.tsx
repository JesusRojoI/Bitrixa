'use client';
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

const TerminosCondicionesPage = () => {
  const t = useTranslations('terms');
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
                {section.subsections?.map((sub: any, j: number) => (
                  <div key={j} className="mb-4">
                    {sub.heading && (
                      <h3 className="text-lg font-black text-orange-500 mb-2">{sub.heading}</h3>
                    )}
                    <p className="text-gray-700 font-bold leading-relaxed">{sub.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TerminosCondicionesPage;