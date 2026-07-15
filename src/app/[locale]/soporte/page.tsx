'use client';
import React from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import ContactForm from '@/components/forms/ContactForm';
import { useTranslations, useLocale } from 'next-intl';

const SoportePage = () => {
  const t = useTranslations('contact');
  const locale = useLocale();

  return (
    <main className="bg-gray-100">
      {/* Breadcrumb / Hero pequeño */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
            <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-orange-400">
              {locale === 'en' ? 'Support' : 'Soporte'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">
            {locale === 'en' ? 'Support' : 'Soporte'}
          </h1>
        </div>
      </section>

      {/* Información de contacto */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Dirección */}
            <div className="text-center bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 shadow-md">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-3">{t('info.address')}</h3>
              <p className="text-gray-700 font-bold text-sm leading-relaxed">
                Avenida Insurgentes Sur, Nº933, Int 102, Piso 1, Colonia Nápoles, Alcaldía Benito Juárez, C.P, 03810, CDMX
              </p>
            </div>

            {/* Teléfono */}
            <div className="text-center bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 shadow-md">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-3">{t('info.phone')}</h3>
              <a
                href="tel:+5215556824394"
                className="text-gray-700 font-bold hover:text-orange-600 transition-colors"
              >
                +52 1 55 5682 4394
              </a>
            </div>

            {/* Correo */}
            <div className="text-center bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 shadow-md">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-3">
                {locale === 'en' ? 'Support Email' : 'Correo de atención'}
              </h3>
              <a
                href="mailto:informacion@bitrixa.com.mx"
                className="text-gray-700 font-bold hover:text-orange-600 transition-colors"
              >
                informacion@bitrixa.com.mx
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-4">
                {t('form.title')}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                {t('form.title')}
              </h2>
              <p className="text-gray-700 font-bold">
                {t('form.description')}
              </p>
              <p className="text-gray-600 font-medium mt-2">
                {locale === 'en'
                  ? 'Complete the form and one of our advisors will contact you to design the perfect strategy for your company.'
                  : 'Completa el formulario y uno de nuestros asesores se pondrá en contacto contigo para diseñar la estrategia perfecta para tu empresa.'}
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Mapa (OpenStreetMap - gratuito, sin API key) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
              {locale === 'en' ? 'Our Location' : 'Nuestra Ubicación'}
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-99.185%2C19.395%2C-99.175%2C19.405&layer=mapnik&marker=19.400%2C-99.180"
                width="100%"
                height="400"
                style={{ border: 'none' }}
                loading="lazy"
                title="Bitrixa Location"
              />
            </div>
            <p className="text-center text-gray-500 text-xs mt-3 font-medium">
              Avenida Insurgentes Sur, Nº933, Colonia Nápoles, CDMX
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SoportePage;