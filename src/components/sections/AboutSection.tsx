'use client';
import React from 'react';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslations, useLocale } from 'next-intl';

const AboutSection = () => {
  const t = useTranslations('about');
  const locale = useLocale();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 space-y-6">
            <p className="text-sm font-black uppercase tracking-widest text-orange-500">
              {t('badge')}
            </p>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              {t('title')}
            </h2>
            
            <p className="text-lg text-gray-800 leading-relaxed font-semibold">
              {t('description')}
            </p>
            
            <a
              href={`/${locale}/la-organizacion`}
              className="group inline-flex items-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <span>{t('cta')}</span>
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                <Image src="/i2.jpg" alt="Bitrixa" fill className="object-cover" />
              </div>
            </div>
            <div>
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                <Image src="/i3.jpg" alt="Bitrixa" fill className="object-cover" />
              </div>
            </div>
            <div>
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                <Image src="/i4.jpg" alt="Bitrixa" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;