'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useTranslations, useLocale } from 'next-intl';
import toast from 'react-hot-toast';

const productSlugs = [
  'desarrollo-de-producto-innovador-2',
  'transformacion-digital-integral',
  'auditoria-tecnica-completa',
];

const productPrices = [40439.00, 29479.00, 24479.00];
const productImages = ['/i5.jpg', '/i6.jpg', '/i7.jpg'];
const productIds = ['prod-1', 'prod-2', 'prod-3'];

const ProductsSection = () => {
  const t = useTranslations('products');
  const pt = useTranslations('productDetail');
  const locale = useLocale();
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Nombres traducidos desde productDetail
  const productNames = pt.raw('items') as Array<{ name: string }>;
  // Solo los primeros 3 productos (índices 0, 1, 2)
  const featuredNames = [productNames[0]?.name, productNames[1]?.name, productNames[2]?.name];

  const handleAddToCart = (index: number) => {
    const productName = featuredNames[index];
    addToCart({
      id: productIds[index],
      name: productName,
      price: productPrices[index],
      slug: productSlugs[index],
      description: '',
    });
    toast.success(`${productName} ${locale === 'en' ? 'added to cart' : 'agregado al carrito'}`, {
      icon: '🛒',
      style: { background: '#111827', color: '#ffffff', border: '2px solid #f97316', fontWeight: 'bold' },
    });
    setTimeout(() => router.push(`/${locale}/carrito`), 1000);
  };

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredNames.map((name, index) => (
            <div
              key={productIds[index]}
              style={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb' }}
              className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col overflow-hidden"
            >
              <a href={`/${locale}/producto/${productSlugs[index]}`} className="relative h-48 overflow-hidden cursor-pointer group">
                <div style={{ backgroundColor: '#111827' }} className="absolute inset-0">
                  <Image src={productImages[index]} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div style={{ backgroundColor: '#111827', opacity: 0.3 }} className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.9)' }} className="rounded-full px-5 py-2 font-black text-white text-sm shadow-lg">
                    {locale === 'en' ? 'View details' : 'Ver detalles'}
                  </div>
                </div>
              </a>

              <div className="p-6 flex flex-col grow">
                <a href={`/${locale}/producto/${productSlugs[index]}`}>
                  <h3 style={{ color: '#111827' }} className="text-xl font-black mb-6 hover:text-orange-600 transition-colors cursor-pointer">
                    {name}
                  </h3>
                </a>

                <div style={{ backgroundColor: '#f3f4f6', border: '2px solid #e5e7eb' }} className="mb-6 text-center rounded-xl p-4">
                  <p style={{ color: '#ea580c' }} className="text-3xl font-black">
                    ${productPrices[index].toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                  <p style={{ color: '#374151' }} className="font-bold text-sm">{t('price')}</p>
                </div>

                <div className="space-y-3 mt-auto">
                  <button
                    onClick={() => handleAddToCart(index)}
                    style={{ backgroundColor: '#f97316', color: '#ffffff' }}
                    className="w-full flex items-center justify-center space-x-3 font-black py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>{t('addToCart')}</span>
                  </button>

                  <a
                    href={`/${locale}/producto/${productSlugs[index]}`}
                    style={{ color: '#ea580c' }}
                    className="block text-center font-black text-sm py-2 hover:underline transition-colors"
                  >
                    {t('viewDetails')} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={`/${locale}/alternativas`}
            style={{ backgroundColor: '#111827', color: '#ffffff' }}
            className="inline-flex items-center space-x-3 px-10 py-5 rounded-full font-black text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <span>{t('cta')}</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;