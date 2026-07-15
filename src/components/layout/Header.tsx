'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBagIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useTranslations, useLocale } from 'next-intl';

const Header = () => {
  const t = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getOpacity = () => {
    if (!isScrolled) return 1;
    if (isHovered) return 1;
    return 0.3;
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    const pathWithoutLocale = pathname.replace(/^\/(es|en)/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    window.location.href = newPath;
  };

  const linkClasses = (href: string) =>
    `relative pb-1 transition-all duration-300 font-bold ${
      pathname === `/${locale}${href}` || pathname === `/${locale}${href}/`
        ? 'text-orange-400'
        : 'text-white hover:text-orange-300'
    }`;

  return (
    <header 
      style={{ 
        backgroundColor: '#1c1917',
        opacity: getOpacity(),
        transition: 'opacity 0.4s ease-in-out'
      }}
      className="sticky top-0 z-50 shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href={`/${locale}`} className="flex items-center shrink-0">
          <Image 
            src="/logo.svg" 
            alt="Bitrixa Logo" 
            width={150} 
            height={40} 
            priority 
            className="w-36 h-10"
          />
        </a>

        {/* Navegación principal */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a href={`/${locale}/la-organizacion`} className={linkClasses('/la-organizacion')}>
            {t('organization')}
          </a>
          <a href={`/${locale}/opciones`} className={linkClasses('/opciones')}>
            {t('options')}
          </a>
          <a href={`/${locale}/alternativas`} className={linkClasses('/alternativas')}>
            {t('alternatives')}
          </a>
          <a href={`/${locale}/soporte`} className={linkClasses('/soporte')}>
            {t('support')}
          </a>
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="relative px-4 py-2 text-sm font-bold rounded-full border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300 group overflow-hidden"
          >
            <span className="absolute inset-0 bg-linear-to-r from-orange-500/20 to-yellow-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
            <span className="relative z-10 flex items-center space-x-1">
              <span className="text-lg">{locale === 'es' ? '🇲🇽' : '🇺🇸'}</span>
              <span>{locale === 'es' ? 'ENG' : 'ESP'}</span>
            </span>
          </button>
        </nav>

        {/* Carrito y Teléfono */}
        <div className="flex items-center space-x-6">
          <a 
            href={`/${locale}/carrito`}
            className={`relative transition-all duration-300 ${
              pathname === `/${locale}/carrito`
                ? 'text-orange-400' 
                : 'text-white hover:text-orange-300'
            }`}
          >
            <ShoppingBagIcon className="h-7 w-7" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </a>
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <PhoneIcon className="h-5 w-5 text-orange-400" />
            <div>
              <p className="leading-tight font-light text-gray-300">{t('callUs')}</p>
              <p className="leading-tight font-bold text-white">{t('phone')}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;