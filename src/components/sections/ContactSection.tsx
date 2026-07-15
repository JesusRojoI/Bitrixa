'use client';
import React from 'react';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';
import ContactForm from '@/components/forms/ContactForm';
import { useTranslations } from 'next-intl';

const ContactSection = () => {
  const t = useTranslations('contact');
  const infoT = useTranslations('contact.info');

  const contactInfo = [
    { icon: MapPinIcon, title: infoT('address'), lines: ['Avenida Insurgentes Sur, Nº933, Int 102, Piso 1', 'Colonia Nápoles, Alcaldía Benito Juárez', 'C.P. 03810, CDMX'] },
    { icon: EnvelopeIcon, title: infoT('email'), lines: ['informacion@bitrixa.com.mx'], href: 'mailto:informacion@bitrixa.com.mx' },
    { icon: PhoneIcon, title: infoT('phone'), lines: ['+52 1 55 5682 4394'], href: 'tel:+5215556824394' },
    { icon: ClockIcon, title: infoT('hours'), lines: [infoT('hoursValue'), infoT('saturday')] },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-4">
            {t('badge')}
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-bold">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div style={{ backgroundColor: '#111827' }} className="rounded-3xl p-10 shadow-xl">
              <h3 className="text-2xl font-black mb-10 flex items-center space-x-3">
                <span>{infoT('title')}</span>
                <div style={{ backgroundColor: '#f97316' }} className="h-1 w-12 rounded-full" />
              </h3>
              
              <div className="space-y-8">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const Content = (
                    <div key={index} className="flex items-start space-x-5">
                      <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }} className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                        <Icon style={{ color: '#fb923c' }} className="h-7 w-7" />
                      </div>
                      <div className="pt-1">
                        <p style={{ color: '#fb923c' }} className="font-black text-base mb-2">{item.title}</p>
                        {item.lines.map((line, idx) => (
                          <p key={idx} className="text-gray-300 text-sm leading-relaxed font-semibold" style={{ marginBottom: idx < item.lines.length - 1 ? '4px' : '0' }}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );

                  if (item.href) {
                    return (
                      <a key={index} href={item.href} className="block hover:bg-white/5 rounded-2xl p-4 -m-4 transition-all duration-300 hover:scale-[1.02]">
                        {Content}
                      </a>
                    );
                  }
                  return <div key={index} className="p-4 -m-4">{Content}</div>;
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;