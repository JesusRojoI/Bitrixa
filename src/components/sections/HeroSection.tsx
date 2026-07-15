'use client';
import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslations, useLocale } from 'next-intl';

const HeroSection = () => {
  const t = useTranslations('hero');
  const locale = useLocale();
  const title = t('title');
  const highlight = t('titleHighlight');

  // Dividir el título por la palabra resaltada
  const parts = title.split(highlight);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/i1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/85"></div>
        <div className="absolute inset-0 bg-linear-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-8 drop-shadow-lg">
            {parts.length > 1 ? (
              <>
                {parts[0]}
                <span className="text-bitrixa-orange-400 drop-shadow-md">{highlight}</span>
                {parts[1]}
              </>
            ) : (
              title
            )}
          </h1>
          
          <p className="text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl drop-shadow-md">
            {t('description')}
          </p>
          
          <a
            href={`/${locale}/la-organizacion`}
            className="group inline-flex items-center space-x-3 bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/50"
          >
            <span>{t('cta')}</span>
            <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120V60C240 0 480 0 720 30C960 60 1200 0 1440 30V120H0Z" fill="#fafaf9" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;