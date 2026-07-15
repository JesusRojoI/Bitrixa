'use client';
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  CommandLineIcon,
  LightBulbIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline';

const iconos = [
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  CommandLineIcon,
  LightBulbIcon,
  ChartBarSquareIcon,
];

const ServicesSection = () => {
  const t = useTranslations('services');
  const locale = useLocale();
  const servicios = t.raw('items') as Array<{ title: string; description: string }>;

  return (
    <section style={{ backgroundColor: '#f3f4f6' }} className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-4">
            {t('badge')}
          </p>
          <h2 style={{ color: '#111827' }} className="text-4xl md:text-5xl font-black mb-6">
            {t('title')}
          </h2>
          <p style={{ color: '#374151' }} className="text-lg max-w-2xl mx-auto font-bold">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio, index) => {
            const Icon = iconos[index];
            return (
              <div
                key={index}
                style={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb' }}
                className="rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative w-20 h-20 mb-6">
                  <div 
                    style={{ 
                      backgroundColor: '#111827',
                      border: '3px solid #f97316',
                      outline: '3px solid #111827',
                      outlineOffset: '3px'
                    }} 
                    className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`trama-${index}`} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                          <circle cx="3" cy="3" r="1.5" fill="#ffffff" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#trama-${index})`} />
                    </svg>
                    <Icon style={{ color: '#fb923c' }} className="h-10 w-10 relative z-10" />
                  </div>
                </div>
                
                <h3 style={{ color: '#111827' }} className="text-xl font-black mb-3">
                  {servicio.title}
                </h3>
                <p style={{ color: '#374151' }} className="leading-relaxed font-bold">
                  {servicio.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <a
            href={`/${locale}/opciones`}
            style={{ backgroundColor: '#111827', color: '#ffffff' }}
            className="inline-flex items-center space-x-3 px-10 py-5 rounded-full font-black text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <span>{t('cta')}</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;