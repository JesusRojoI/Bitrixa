'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { productos, ProductoData } from '@/data/productos';
import ContactForm from '@/components/forms/ContactForm';
import { useTranslations, useLocale } from 'next-intl';
import toast from 'react-hot-toast';

const AlternativasPage = () => {
  const t = useTranslations('products');
  const pt = useTranslations('productDetail');
  const contactT = useTranslations('contact');
  const locale = useLocale();
  const { addToCart } = useCart();
  const router = useRouter();

  const productNames = pt.raw('items') as Array<{ name: string }>;

  const handleAddToCart = (producto: ProductoData) => {
    const translatedName = productNames[producto.translationIndex]?.name || producto.nombre;

    if (producto.precio === 0) {
      router.push(`/${locale}/producto/${producto.slug}`);
      return;
    }

    addToCart({
      id: producto.id,
      name: translatedName,
      price: producto.precio,
      slug: producto.slug,
      description: producto.descripcion,
    });
    toast.success(`${translatedName} ${locale === 'en' ? 'added to cart' : 'agregado al carrito'}`, {
      icon: '🛒',
      style: { background: '#111827', color: '#ffffff', border: '2px solid #f97316', fontWeight: 'bold' },
    });
    setTimeout(() => router.push(`/${locale}/carrito`), 1000);
  };

  return (
    <main className="bg-gray-100">
      {/* Breadcrumb / Hero pequeño */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
            <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">Home</a>
            <span>/</span>
            <span className="text-orange-400">{t('badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">{t('badge')}</h1>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-4">
              {locale === 'en' ? 'ALL ALTERNATIVES' : 'TODAS LAS ALTERNATIVAS'}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">{t('title')}</h2>
            <p className="text-gray-800 font-bold text-lg max-w-2xl mx-auto">{t('description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((producto) => {
              const translatedName = productNames[producto.translationIndex]?.name || producto.nombre;
              return (
                <div
                  key={producto.id}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col overflow-hidden border-2 border-gray-200"
                >
                  {/* Imagen clickeable */}
                  <a href={`/${locale}/producto/${producto.slug}`} className="relative h-48 overflow-hidden cursor-pointer group">
                    <div className="absolute inset-0 bg-gray-900">
                      <Image
                        src={producto.imagen}
                        alt={translatedName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={producto.imagen.startsWith('http')}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gray-900 opacity-30 transition-opacity duration-300 group-hover:opacity-0" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-orange-500/90 rounded-full px-5 py-2 font-black text-white text-sm shadow-lg">
                        {locale === 'en' ? 'View details' : 'Ver detalles'}
                      </div>
                    </div>
                  </a>

                  {/* Contenido */}
                  <div className="p-6 flex flex-col grow">
                    <a href={`/${locale}/producto/${producto.slug}`}>
                      <h3 className="text-xl font-black text-gray-900 mb-4 hover:text-orange-600 transition-colors cursor-pointer">
                        {translatedName}
                      </h3>
                    </a>

                    {/* Precio */}
                    <div className="bg-gray-100 border-2 border-gray-200 mb-6 text-center rounded-xl p-4">
                      <p className="text-3xl font-black text-orange-600">
                        {producto.precio === 0
                          ? (locale === 'en' ? 'Custom' : 'Personalizada')
                          : `$${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                      </p>
                      <p className="text-gray-700 font-bold text-sm">{t('price')}</p>
                    </div>

                    {/* Acciones */}
                    <div className="space-y-3 mt-auto">
                      <button
                        onClick={() => handleAddToCart(producto)}
                        className="w-full flex items-center justify-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                        <span>
                          {producto.precio === 0
                            ? (locale === 'en' ? 'Request a quote' : 'Solicitar cotización')
                            : t('addToCart')}
                        </span>
                      </button>

                      <a
                        href={`/${locale}/producto/${producto.slug}`}
                        className="block text-center text-orange-600 hover:text-orange-800 font-black text-sm py-2 hover:underline transition-colors"
                      >
                        {t('viewDetails')} →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección de contacto */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-4">{contactT('badge')}</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">{contactT('form.title')}</h2>
            <p className="text-gray-800 font-bold text-lg max-w-2xl mx-auto">{contactT('form.description')}</p>
          </div>

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

          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AlternativasPage;