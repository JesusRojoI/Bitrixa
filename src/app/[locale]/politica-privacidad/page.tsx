'use client';
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

const PoliticaPrivacidadPage = () => {
  const t = useTranslations('privacy');
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
            
            {/* Sección 1 */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">{t('sections.0.title')}</h2>
              <p className="text-gray-700 font-bold leading-relaxed mb-4">{t('sections.0.content1')}</p>
              <p className="text-gray-700 font-bold leading-relaxed mb-4">{t('sections.0.content2')}</p>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-2">
                {t.raw('sections.0.contact')?.map((line: string, i: number) => (
                  <p key={i} className="text-gray-700 font-bold text-sm">{line}</p>
                ))}
              </div>
              <p className="text-gray-700 font-bold leading-relaxed mt-4">{t('sections.0.content3')}</p>
            </div>

            {/* Sección 2 */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">{t('sections.1.title')}</h2>
              {t.raw('sections.1.subsections')?.map((sub: any, i: number) => (
                <div key={i} className="mb-4">
                  <h3 className="text-lg font-black text-orange-500 mb-2">{sub.heading}</h3>
                  <p className="text-gray-700 font-bold leading-relaxed">{sub.content}</p>
                </div>
              ))}
            </div>

            {/* Sección 3 */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">{t('sections.2.title')}</h2>
              {t.raw('sections.2.subsections')?.map((sub: any, i: number) => (
                <div key={i} className="mb-4">
                  <h3 className="text-lg font-black text-orange-500 mb-2">{sub.heading}</h3>
                  <p className="text-gray-700 font-bold leading-relaxed">{sub.content}</p>
                </div>
              ))}
            </div>

            {/* Sección 4 - Cookies */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">{t('sections.3.title')}</h2>
              {t.raw('sections.3.subsections')?.map((sub: any, i: number) => (
                <div key={i} className="mb-4">
                  <h3 className="text-lg font-black text-orange-500 mb-2">{sub.heading}</h3>
                  <p className="text-gray-700 font-bold leading-relaxed">{sub.content}</p>
                </div>
              ))}
            </div>

            {/* Sección 5 - Derechos */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">{t('sections.4.title')}</h2>
              {t.raw('sections.4.rights')?.map((right: any, i: number) => (
                <div key={i} className="mb-4">
                  <h3 className="text-lg font-black text-orange-500 mb-2">{right.heading}</h3>
                  <p className="text-gray-700 font-bold leading-relaxed">{right.content}</p>
                </div>
              ))}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-2 mt-4">
                <h3 className="text-lg font-black text-orange-500 mb-2">{t('sections.4.procedure.title')}</h3>
                {t.raw('sections.4.procedure.steps')?.map((step: any, i: number) => (
                  <div key={i}>
                    <p className="text-gray-700 font-bold text-sm">{step.label}</p>
                    {step.items?.map((item: string, j: number) => (
                      <p key={j} className="text-gray-600 text-sm ml-4">• {item}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Sección 6 - Contacto */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
              <h2 className="text-xl font-black text-gray-900 mb-3">{t('sections.5.title')}</h2>
              <p className="text-gray-700 font-bold">{t('sections.5.content')}</p>
              <a href="mailto:informacion@bitrixa.com.mx" className="text-orange-500 font-black hover:underline">
                informacion@bitrixa.com.mx
              </a>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default PoliticaPrivacidadPage;