'use client';
import React from 'react';
import Image from 'next/image';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import ContactForm from '@/components/forms/ContactForm';
import { useTranslations, useLocale } from 'next-intl';

const OpcionesPage = () => {
  const t = useTranslations('services');
  const contactT = useTranslations('contact');
  const locale = useLocale();
  const servicios = t.raw('items') as Array<{
    title: string;
    description: string;
    beneficios: string[];
  }>;

  const imagenes = ['/i11.jpg', '/i12.jpg', '/i13.jpg', '/i14.jpg', '/i15.jpg', '/i16.jpg'];

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
              {locale === 'en' ? 'Options' : 'Opciones'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">
            {locale === 'en' ? 'Options' : 'Opciones'}
          </h1>
        </div>
      </section>

      {/* Secciones alternadas */}
      {servicios.map((servicio, index) => {
        const esPar = index % 2 === 0;
        return (
          <section
            key={index}
            className={`py-20 ${esPar ? 'bg-white' : 'bg-gray-100'}`}
          >
            <div className="container mx-auto px-4">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
              >
                {/* Imagen */}
                <div className={`${esPar ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={imagenes[index]}
                      alt={servicio.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-900/20"></div>
                  </div>
                </div>

                {/* Contenido */}
                <div className={`${esPar ? 'lg:order-2' : 'lg:order-1'}`}>
                  <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-3">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                    {servicio.title}
                  </h2>
                  <p className="text-gray-800 font-bold leading-relaxed mb-8">
                    {servicio.description}
                  </p>

                  {/* Beneficios */}
                  <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-black text-orange-500 mb-4 uppercase tracking-wider">
                      {locale === 'en' ? 'Benefits' : 'Beneficios'}
                    </h3>
                    <ul className="space-y-3">
                      {servicio.beneficios.map((beneficio, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                          <span className="text-gray-800 font-bold text-sm leading-relaxed">
                            {beneficio}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

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
    </main>
  );
};

export default OpcionesPage;