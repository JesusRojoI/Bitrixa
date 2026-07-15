'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer style={{ backgroundColor: '#111827' }} className="text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y Dirección */}
          <div className="col-span-1 md:col-span-2">
            <a href={`/${locale}`} className="inline-block mb-4">
              <Image 
                src="/logo.svg" 
                alt="Bitrixa Logo" 
                width={180} 
                height={50} 
                className="brightness-0 invert w-44 h-12"
              />
            </a>
            <p className="mb-2 font-semibold">{t('address')}</p>
            <p className="mb-2 font-bold">{t('phone')}</p>
            <p className="mb-4 font-bold">{t('email')}</p>
            
            {/* Logos de pago */}
            <div className="flex items-center space-x-4 mt-4">
              <div className="bg-white rounded-lg px-3 py-2 shadow-md">
                <Image 
                  src="/visa.svg" 
                  alt="Visa" 
                  width={60} 
                  height={35}
                  className="object-contain w-16 h-8"
                  style={{ filter: 'none' }}
                />
              </div>
              
              <div className="bg-white rounded-lg px-3 py-2 shadow-md">
                <Image 
                  src="/mastercard.svg" 
                  alt="Mastercard" 
                  width={50} 
                  height={35}
                  className="object-contain w-12 h-8"
                  style={{ filter: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-white font-black text-lg mb-4">{t('company')}</h4>
            <ul className="space-y-3">
              <li><a href={`/${locale}`} className="text-gray-300 hover:text-orange-400 transition-colors font-bold">{t('home')}</a></li>
              <li><a href={`/${locale}/la-organizacion`} className="text-gray-300 hover:text-orange-400 transition-colors font-bold">{t('organization')}</a></li>
              <li><a href={`/${locale}/opciones`} className="text-gray-300 hover:text-orange-400 transition-colors font-bold">{t('options')}</a></li>
              <li><a href={`/${locale}/alternativas`} className="text-gray-300 hover:text-orange-400 transition-colors font-bold">{t('alternatives')}</a></li>
              <li><a href={`/${locale}/soporte`} className="text-gray-300 hover:text-orange-400 transition-colors font-bold">{t('support')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-black text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href={`/${locale}/politica-privacidad`} className="text-gray-300 hover:text-orange-400 transition-colors font-bold">{t('privacy')}</a></li>
              <li><a href={`/${locale}/terminos-y-condiciones`} className="text-gray-300 hover:text-orange-400 transition-colors font-bold">{t('terms')}</a></li>
              <li><a href={`/${locale}/politica-de-reembolso`} className="text-gray-300 hover:text-orange-400 transition-colors font-bold">{t('refunds')}</a></li>
            </ul>
          </div>
        </div>

        <div style={{ borderColor: '#374151' }} className="border-t pt-6 text-center text-sm">
          <p className="text-gray-400 font-bold">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;