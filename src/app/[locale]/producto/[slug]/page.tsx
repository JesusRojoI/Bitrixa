'use client';
import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCartIcon, ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { productos } from '@/data/productos';
import { useTranslations, useLocale } from 'next-intl';
import toast from 'react-hot-toast';

// Mapeo de slugs a claves de traducción
const slugToTranslationKey: Record<string, number> = {
  'desarrollo-de-producto-innovador-2': 0,
  'transformacion-digital-integral': 1,
  'auditoria-tecnica-completa': 2,
  'consultoria-en-ciencia-de-datos': 3,
  'automatizacion-de-procesos-industriales': 4,
  'laboratorio-de-pruebas-y-ensayos': 5,
  'simulacion-y-modelado-computacional': 6,
  'ciberseguridad-empresarial': 7,
  'internet-de-las-cosas-iot-industrial': 8,
  'certificacion-iso-y-normativas': 9,
  'biotecnologia-aplicada': 10,
  'energias-renovables-y-eficiencia': 11,
  'realidad-aumentada-y-virtual': 12,
  'blockchain-y-trazabilidad': 13,
  'impresion-3d-y-prototipado-rapido': 14,
};

const ProductoPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('productDetail');
  const { addToCart } = useCart();

  const producto = productos.find((p) => p.slug === slug);
  const translationIndex = slugToTranslationKey[slug as string] ?? 0;
  const productName = t(`items.${translationIndex}.name`);
  const productDescription = t(`items.${translationIndex}.description`);
  const productServices = t(`items.${translationIndex}.services`);
  const productFeatures = t.raw(`items.${translationIndex}.features`) as string[];

  if (!producto) {
    return (
      <main className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            {locale === 'en' ? 'Product not found' : 'Producto no encontrado'}
          </h1>
          <a href={`/${locale}/alternativas`} className="text-orange-500 font-bold hover:underline">
            {locale === 'en' ? 'Back to alternatives' : 'Volver a alternativas'}
          </a>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: producto.id,
      name: productName,
      price: producto.precio,
      slug: producto.slug,
      description: producto.descripcion,
    });
    toast.success(`${productName} ${locale === 'en' ? 'added to cart' : 'agregado al carrito'}`, {
      icon: '🛒',
      style: {
        background: '#111827',
        color: '#ffffff',
        border: '2px solid #f97316',
        fontWeight: 'bold',
      },
    });

    setTimeout(() => {
      router.push(`/${locale}/carrito`);
    }, 1000);
  };

  return (
    <main className="bg-gray-100">
      {/* Breadcrumb */}
      <section className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
            <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">
              Home
            </a>
            <span>/</span>
            <a href={`/${locale}/alternativas`} className="hover:text-orange-400 transition-colors">
              {locale === 'en' ? 'Alternatives' : 'Alternativas'}
            </a>
            <span>/</span>
            <span className="text-orange-400">{productName}</span>
          </div>
          <a
            href={`/${locale}/alternativas`}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors font-bold"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>{locale === 'en' ? 'Back to alternatives' : 'Volver a alternativas'}</span>
          </a>
        </div>
      </section>

      {/* Detalle del producto */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Imagen */}
            <div className="relative h-80 lg:h-full min-h-100 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={producto.imagen}
                alt={productName}
                fill
                className="object-cover"
                unoptimized={producto.imagen.startsWith('http')}
              />
            </div>

            {/* Contenido */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-3">
                {locale === 'en' ? 'Product' : 'Producto'}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                {productName}
              </h1>

              {/* Precio */}
              <div className="mb-6">
                <p className="text-4xl font-black text-orange-600">
                  ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-gray-700 font-bold text-sm mt-1">
                  {locale === 'en' ? 'MXN + VAT' : 'MXN + IVA'}
                </p>
              </div>

              {/* Descripción */}
              <p className="text-gray-800 font-bold leading-relaxed mb-6">
                {productDescription}
              </p>

              {/* SKU */}
              <div className="flex items-center space-x-2 mb-6 bg-gray-200 rounded-lg px-4 py-2 w-fit">
                <TagIcon className="h-5 w-5 text-gray-600" />
                <p className="text-gray-700 font-bold text-sm">
                  SKU: <span className="font-black">{producto.sku}</span>
                </p>
              </div>

              {/* Botón Agregar al carrito */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl mb-8"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="text-lg">
                  {locale === 'en' ? 'Add to Cart' : 'Agregar al carrito'}
                </span>
              </button>

              {/* Servicios incluidos */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md mb-6">
                <h3 className="text-lg font-black text-orange-500 mb-3 uppercase tracking-wider">
                  {locale === 'en' ? 'Services Included' : 'Servicios incluidos'}
                </h3>
                <p className="text-gray-800 font-bold leading-relaxed">
                  {productServices}
                </p>
              </div>

              {/* Características */}
              {productFeatures && productFeatures.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md">
                  <h3 className="text-lg font-black text-orange-500 mb-4 uppercase tracking-wider">
                    {locale === 'en' ? 'Features' : 'Características'}
                  </h3>
                  <ul className="space-y-3">
                    {productFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <svg className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-800 font-bold text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductoPage;