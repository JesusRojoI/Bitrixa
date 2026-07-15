'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import ContactForm from '@/components/forms/ContactForm';
import { useTranslations, useLocale } from 'next-intl';

const LaOrganizacionPage = () => {
  const t = useTranslations('organization');
  const contactT = useTranslations('contact');
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const accordionItems = [
    {
      title: t('value.commitment'),
      content: t('value.commitmentContent'),
    },
    {
      title: t('value.mission'),
      content: t('value.missionContent'),
    },
    {
      title: t('value.team'),
      content: t('value.teamContent'),
    },
  ];

  return (
    <>
      {/* Breadcrumb / Hero pequeño */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
            <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">
              {t('breadcrumb')}
            </a>
            <span>/</span>
            <span className="text-orange-400">{t('title')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">
            {t('title')}
          </h1>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-4">
                {t('about.badge')}
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                {t('about.title')}
              </h2>
              <p className="text-gray-800 font-bold leading-relaxed mb-6">
                {t('about.description1')}
              </p>
              <p className="text-gray-800 font-bold leading-relaxed mb-6">
                {t('about.description2')}
              </p>
              <p className="text-gray-800 font-bold leading-relaxed">
                {t('about.description3')}
              </p>
            </div>

            {/* Imágenes mosaico */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/i8.jpg" alt="Bitrixa" fill className="object-cover" />
                </div>
              </div>
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/i9.jpg" alt="Bitrixa" fill className="object-cover" />
                </div>
              </div>
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl">
                  <Image src="/i10.jpg" alt="Bitrixa" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra oferta de valor + Acordeón */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-4 text-center">
              {t('value.badge')}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-10 text-center">
              {t('value.title')}
            </h2>
            <p className="text-gray-800 font-bold text-lg text-center mb-12 max-w-2xl mx-auto">
              {t('value.description')}
            </p>

            {/* Acordeón */}
            <div className="space-y-4">
              {accordionItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-md"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-6 text-left font-black text-gray-900 hover:bg-gray-50 transition-colors duration-300"
                  >
                    <span className="text-lg md:text-xl">{item.title}</span>
                    {openIndex === index ? (
                      <ChevronUpIcon className="h-6 w-6 text-orange-500 shrink-0" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-orange-500 shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-800 font-bold leading-relaxed">{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de contacto */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-4">
              {contactT('badge')}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              {contactT('form.title')}
            </h2>
            <p className="text-gray-800 font-bold text-lg max-w-2xl mx-auto">
              {contactT('form.description')}
            </p>
          </div>

          {/* Información de contacto rápida */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
            <div className="text-center">
              <p className="text-orange-500 font-black text-lg mb-2">{contactT('info.address')}</p>
              <p className="text-gray-800 font-bold text-sm leading-relaxed">
                Avenida Insurgentes Sur, Nº933, Int 102, Piso 1, Colonia Nápoles, Alcaldía Benito Juárez, C.P, 03810, CDMX
              </p>
            </div>
            <div className="text-center">
              <p className="text-orange-500 font-black text-lg mb-2">{contactT('info.email')}</p>
              <a href="mailto:informacion@bitrixa.com.mx" className="text-gray-800 font-bold hover:text-orange-600 transition-colors">
                informacion@bitrixa.com.mx
              </a>
            </div>
            <div className="text-center">
              <p className="text-orange-500 font-black text-lg mb-2">{contactT('info.phone')}</p>
              <a href="tel:+5215556824394" className="text-gray-800 font-bold hover:text-orange-600 transition-colors">
                +52 1 55 5682 4394
              </a>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default LaOrganizacionPage;