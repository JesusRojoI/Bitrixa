'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Language = 'es' | 'en';

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState<Language>('es');
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    
    // Preparado para i18n futuro con rutas /es/... y /en/...
    // Cuando implementes next-intl, descomenta esto:
    // const newPath = pathname.replace(`/${language}`, `/${newLang}`);
    // router.push(newPath);
    
    console.log(`Idioma cambiado a: ${newLang}`);
    
    // Aquí puedes guardar la preferencia en localStorage
    localStorage.setItem('bitrixa-language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative px-4 py-2 text-sm font-bold rounded-full border-2 border-bitrixa-orange-500/50 text-bitrixa-orange-400 hover:bg-bitrixa-orange-500/10 hover:border-bitrixa-orange-400 transition-all duration-300 group overflow-hidden"
      aria-label={`Cambiar idioma a ${language === 'es' ? 'Inglés' : 'Español'}`}
      title={`Cambiar a ${language === 'es' ? 'English' : 'Español'}`}
    >
      {/* Fondo animado */}
      <span className="absolute inset-0 bg-linear-to-r from-bitrixa-orange-500/20 to-bitrixa-yellow-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
      
      {/* Texto con animación */}
      <span className="relative z-10 flex items-center space-x-2">
        <span className="text-lg transform group-hover:rotate-12 transition-transform duration-300">
          {language === 'es' ? '🇲🇽' : '🇺🇸'}
        </span>
        <span className="relative">
          {language === 'es' ? 'ESP' : 'ENG'}
          <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-bitrixa-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </span>
      </span>
    </button>
  );
};

export default LanguageSwitcher;