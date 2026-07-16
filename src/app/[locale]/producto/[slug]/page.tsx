'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCartIcon, ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { productos } from '@/data/productos';
import { useTranslations, useLocale } from 'next-intl';
import toast from 'react-hot-toast';

const slugToTranslationKey: Record<string, number> = {
  'alternativa-personalizada': 0,
  'transformacion-digital-integral': 1,
  'desarrollo-de-producto-innovador': 2,
  'auditoria-tecnica-media': 3,
  'auditoria-tecnica-completa': 4,
  'consultoria-en-regulacion-y-cumplimiento': 5,
  'desarrollo-de-software-a-medida': 6,
  'desarrollo-de-software-basico': 7,
  'implementacion-de-sistema-de-media': 8,
  'implementacion-de-sistema-de-calidad-basica': 9,
  'capacitacion-tecnica-intensiva': 10,
  'desarrollo-de-prototipo-basico': 11,
  'consultoria-media': 12,
  'consultoria-basica': 13,
  'analisis-rapido': 14,
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

  // Estado para Alternativa Personalizada
  const [folio, setFolio] = useState('');
  const [precioPersonalizado, setPrecioPersonalizado] = useState('');
  const [errors, setErrors] = useState<{ folio?: string; precio?: string }>({});

  const isPersonalizada = producto?.precio === 0;

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

  const validarFormulario = (): boolean => {
    const newErrors: { folio?: string; precio?: string } = {};

    if (!folio.trim()) {
      newErrors.folio = locale === 'en' ? 'Folio number is required' : 'El número de folio es requerido';
    }

    const precioNum = parseFloat(precioPersonalizado);
if (!precioPersonalizado.trim() || isNaN(precioNum) || precioNum <= 0) {
  newErrors.precio = locale === 'en' ? 'Enter a valid positive amount' : 'Ingresa una cantidad positiva válida';
}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (isPersonalizada) {
      if (!validarFormulario()) {
        toast.error(
          locale === 'en' ? 'Please fill in all fields correctly' : 'Por favor completa todos los campos correctamente',
          { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' } }
        );
        return;
      }

      const precioFinal = parseFloat(precioPersonalizado);
      addToCart({
        id: producto.id,
        name: `${productName} - ${folio}`,
        price: precioFinal,
        slug: producto.slug,
        description: producto.descripcion,
      });
      toast.success(`${productName} ${locale === 'en' ? 'added to cart' : 'agregado al carrito'}`, {
        icon: '🛒',
        style: { background: '#111827', color: '#ffffff', border: '2px solid #f97316', fontWeight: 'bold' },
      });
      setTimeout(() => router.push(`/${locale}/carrito`), 1000);
      return;
    }

    addToCart({
      id: producto.id,
      name: productName,
      price: producto.precio,
      slug: producto.slug,
      description: producto.descripcion,
    });
    toast.success(`${productName} ${locale === 'en' ? 'added to cart' : 'agregado al carrito'}`, {
      icon: '🛒',
      style: { background: '#111827', color: '#ffffff', border: '2px solid #f97316', fontWeight: 'bold' },
    });
    setTimeout(() => router.push(`/${locale}/carrito`), 1000);
  };

  return (
    <main className="bg-gray-100">
      {/* Breadcrumb */}
      <section className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
            <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">Home</a>
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

              {/* Campos para Alternativa Personalizada */}
              {isPersonalizada && (
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2">
                      {locale === 'en' ? 'Folio Number' : 'No. de folio'} *
                    </label>
                    <input
                      type="text"
                      value={folio}
                      onChange={(e) => {
                        setFolio(e.target.value);
                        if (errors.folio) setErrors(prev => ({ ...prev, folio: undefined }));
                      }}
                      placeholder={locale === 'en' ? 'Enter folio number' : 'Ingresa el número de folio'}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-400 font-bold ${
                        errors.folio
                          ? 'border-red-400 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                      }`}
                    />
                    {errors.folio && (
                      <p className="mt-1 text-sm text-red-600 font-bold">{errors.folio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2">
                      {locale === 'en' ? 'Total/Partial Payment' : 'Pago total/parcial'} *
                    </label>
                    <input
                      type="number"
                      value={precioPersonalizado}
                      onChange={(e) => {
                        setPrecioPersonalizado(e.target.value);
                        if (errors.precio) setErrors(prev => ({ ...prev, precio: undefined }));
                      }}
                      placeholder={locale === 'en' ? 'Enter amount' : 'Ingresa la cantidad'}
                      step="0.01"
                      min="0.01"
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-400 font-bold ${
                        errors.precio
                          ? 'border-red-400 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                      }`}
                    />
                    {errors.precio && (
                      <p className="mt-1 text-sm text-red-600 font-bold">{errors.precio}</p>
                    )}
                  </div>

                  <p className="text-sm font-bold text-gray-600">
                    {locale === 'en'
                      ? 'Mexican pesos plus 16% VAT'
                      : 'pesos mexicanos más 16% de IVA'}
                  </p>
                </div>
              )}

              {/* Precio (solo para productos no personalizados) */}
              {!isPersonalizada && (
                <div className="mb-6">
                  <p className="text-4xl font-black text-orange-600">
                    ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-gray-700 font-bold text-sm mt-1">
                    {locale === 'en' ? 'MXN + VAT' : 'MXN + IVA'}
                  </p>
                </div>
              )}

              {/* Botón Agregar al carrito */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl mb-8"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="text-lg">
                  {isPersonalizada
                    ? (locale === 'en' ? 'Add to Cart' : 'Agregar al carrito')
                    : (locale === 'en' ? 'Add to Cart' : 'Agregar al carrito')}
                </span>
              </button>

              {/* Info adicional para Alternativa Personalizada */}
              {isPersonalizada && (
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md mb-6">
                  <p className="text-gray-800 font-bold leading-relaxed mb-3">
                    {locale === 'en'
                      ? "None of our current programs fit what you need? Don't worry, we create a tailor-made alternative for you."
                      : '¿Ninguno de nuestros programas actuales se ajusta a lo que necesitas? No te preocupes, creamos una alternativa hecha a tu medida.'}
                  </p>
                  <ul className="space-y-2 text-gray-700 font-bold text-sm">
                    <li>
                      {locale === 'en'
                        ? '🔹 Request your personalized quote according to your requirements.'
                        : '🔹 Solicita tu cotización personalizada según tus requerimientos.'}
                    </li>
                    <li>
                      {locale === 'en'
                        ? '🔹 Once approved, we will assign you an alternative number so you can make your payment easily and securely.'
                        : '🔹 Una vez aprobada, te asignaremos un número de alternativa para que realices tu pago de forma fácil y segura.'}
                    </li>
                    <li>
                      {locale === 'en'
                        ? '🔹 This way you will have exactly what you are looking for, with the flexibility to pay only for what you need.'
                        : '🔹 Así tendrás exactamente lo que buscas, con la flexibilidad de pagar solo por lo que necesitas.'}
                    </li>
                  </ul>
                  <p className="text-gray-800 font-bold mt-3">
                    {locale === 'en'
                      ? '📩 Contact us today and receive your personalized proposal.'
                      : '📩 Contáctanos hoy y recibe tu propuesta personalizada.'}
                  </p>
                </div>
              )}

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
                        <span className="text-gray-800 font-bold text-sm leading-relaxed">{feature}</span>
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