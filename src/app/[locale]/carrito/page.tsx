'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TrashIcon, MinusIcon, PlusIcon, TagIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useTranslations, useLocale } from 'next-intl';
import { productos } from '@/data/productos';
import toast from 'react-hot-toast';

const cupones = [
  { codigo: 'BITRIXA10', descuento: 10 },
  { codigo: 'INNOVACION10', descuento: 10 },
  { codigo: 'CIENCIA10', descuento: 10 },
];

interface CuponGuardado {
  codigo: string;
  descuento: number;
}

const CarritoPage = () => {
  const t = useTranslations('cart');
  const pt = useTranslations('productDetail');
  const locale = useLocale();
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [cuponUsado, setCuponUsado] = useState('');
  const router = useRouter();

  // Nombres de productos traducidos
  const productNames = pt.raw('items') as Array<{ name: string }>;

  // Obtener nombre traducido según el idioma actual
  const getTranslatedName = (itemId: string, fallbackName: string) => {
    const productoData = productos.find(p => p.id === itemId);
    if (productoData) {
      return productNames[productoData.translationIndex]?.name || fallbackName;
    }
    return fallbackName;
  };

  useEffect(() => {
    const cuponGuardado = localStorage.getItem('bitrixa-cupon');
    if (cuponGuardado) {
      try {
        const cupon: CuponGuardado = JSON.parse(cuponGuardado);
        setDescuentoAplicado(cupon.descuento);
        setCuponUsado(cupon.codigo);
      } catch (error) {
        console.error('Error al leer cupón guardado');
      }
    }
  }, []);

  const subtotal = getCartTotal();
  const iva = subtotal * 0.16;
  const descuento = (subtotal * descuentoAplicado) / 100;
  const total = subtotal + iva - descuento;

  const handleAplicarCupon = () => {
    if (cuponUsado) {
      toast.error(
        locale === 'en' ? 'You already have a coupon applied' : 'Ya tienes un cupón aplicado',
        { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' } }
      );
      return;
    }

    const cuponEncontrado = cupones.find(
      (c) => c.codigo.toLowerCase() === codigoCupon.trim().toLowerCase()
    );

    if (cuponEncontrado) {
      setDescuentoAplicado(cuponEncontrado.descuento);
      setCuponUsado(cuponEncontrado.codigo);
      localStorage.setItem('bitrixa-cupon', JSON.stringify({
        codigo: cuponEncontrado.codigo,
        descuento: cuponEncontrado.descuento
      }));
      toast.success(
        locale === 'en'
          ? `Coupon applied! ${cuponEncontrado.descuento}% discount`
          : `¡Cupón aplicado! ${cuponEncontrado.descuento}% de descuento`,
        { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', fontWeight: 'bold' } }
      );
    } else {
      toast.error(
        locale === 'en' ? 'Invalid coupon' : 'Cupón no válido',
        { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' } }
      );
    }
  };

  const handleEliminarCupon = () => {
    setDescuentoAplicado(0);
    setCuponUsado('');
    setCodigoCupon('');
    localStorage.removeItem('bitrixa-cupon');
    toast.success(
      locale === 'en' ? 'Coupon removed' : 'Cupón eliminado',
      { style: { background: '#fff7ed', color: '#9a3412', border: '1px solid #fdba74', fontWeight: 'bold' } }
    );
  };

  const handleCantidad = (productId: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) {
      removeFromCart(productId);
      toast.success(
        locale === 'en' ? 'Product removed from cart' : 'Producto eliminado del carrito',
        { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' } }
      );
    } else {
      updateQuantity(productId, nuevaCantidad);
    }
  };

  const handleEliminarProducto = (productId: string, nombre: string) => {
    removeFromCart(productId);
    toast.success(
      `${nombre} ${locale === 'en' ? 'removed from cart' : 'eliminado del carrito'}`,
      { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' } }
    );
  };

  const handleVaciarCarrito = () => {
    clearCart();
    localStorage.removeItem('bitrixa-cupon');
    setDescuentoAplicado(0);
    setCuponUsado('');
    setCodigoCupon('');
    toast.success(
      locale === 'en' ? 'Cart emptied' : 'Carrito vaciado',
      { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' } }
    );
  };

  const handleProcederPago = () => {
    router.push(`/${locale}/finalizar-compra`);
  };

  const getImagenProducto = (id: string) => {
    const imagenesLocales: Record<string, string> = {
      'prod-1': '/i5.jpg',
      'prod-2': '/i6.jpg',
      'prod-3': '/i7.jpg',
    };
    return imagenesLocales[id] || '/i5.jpg';
  };

  if (items.length === 0) {
    return (
      <main className="bg-gray-100 min-h-screen">
        <section className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
              <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">
                Home
              </a>
              <span>/</span>
              <span className="text-orange-400">{t('title')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">{t('title')}</h1>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl max-w-lg mx-auto border-2 border-gray-200">
              <h2 className="text-2xl font-black text-gray-900 mb-4">{t('empty')}</h2>
              <p className="text-gray-700 font-bold mb-8">{t('emptyDescription')}</p>
              <a
                href={`/${locale}/alternativas`}
                className="inline-flex items-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 shadow-xl"
              >
                {t('viewAlternatives')}
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
            <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-orange-400">{t('title')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">{t('title')}</h1>
        </div>
      </section>

      {/* Contenido del carrito */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {/* Encabezados de tabla */}
              <div className="hidden md:grid grid-cols-12 gap-4 bg-white rounded-2xl p-4 border-2 border-gray-200 font-black text-sm text-gray-900">
                <div className="col-span-1"></div>
                <div className="col-span-4">{t('product')}</div>
                <div className="col-span-2 text-center">{t('price')}</div>
                <div className="col-span-2 text-center">{t('quantity')}</div>
                <div className="col-span-2 text-right">{t('subtotal')}</div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item) => {
                const displayName = getTranslatedName(item.id, item.name);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    {/* Imagen */}
                    <div className="md:col-span-1 flex justify-center">
                      <a
                        href={`/${locale}/producto/${item.slug}`}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 shrink-0 relative block"
                      >
                        <Image
                          src={getImagenProducto(item.id)}
                          alt={displayName}
                          fill
                          className="object-cover"
                        />
                      </a>
                    </div>

                    {/* Nombre */}
                    <div className="md:col-span-4">
                      <a href={`/${locale}/producto/${item.slug}`}>
                        <h3 className="text-base md:text-lg font-black text-gray-900 hover:text-orange-600 transition-colors">
                          {displayName}
                        </h3>
                      </a>
                      <p className="text-orange-600 font-black text-sm mt-1 md:hidden">
                        ${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                      </p>
                    </div>

                    {/* Precio */}
                    <div className="md:col-span-2 text-center hidden md:block">
                      <p className="text-gray-900 font-black">
                        ${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Cantidad */}
                    <div className="md:col-span-2 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleCantidad(item.id, item.quantity - 1)}
                        className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <MinusIcon className="h-4 w-4 text-gray-700" />
                      </button>
                      <span className="text-lg font-black text-gray-900 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleCantidad(item.id, item.quantity + 1)}
                        className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="md:col-span-2 text-right">
                      <p className="text-lg font-black text-gray-900">
                        ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Eliminar */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() => handleEliminarProducto(item.id, displayName)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title={locale === 'en' ? 'Remove product' : 'Eliminar producto'}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Acciones inferiores */}
              <div className="flex justify-between items-center pt-4">
                <a
                  href={`/${locale}/alternativas`}
                  className="text-orange-500 hover:text-orange-600 font-bold text-sm underline transition-colors"
                >
                  {t('continueShopping')}
                </a>
                <button
                  onClick={handleVaciarCarrito}
                  className="text-red-500 hover:text-red-600 font-bold text-sm underline transition-colors"
                >
                  {t('emptyCart')}
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 sticky top-24">
                <h2 className="text-xl font-black text-gray-900 mb-6">{t('summary')}</h2>

                {/* Cupón */}
                <div className="mb-6">
                  <label className="block text-sm font-black text-gray-900 mb-2">
                    {t('coupon')}
                  </label>
                  {cuponUsado ? (
                    <div className="flex items-center justify-between bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <TagIcon className="h-5 w-5 text-green-600" />
                        <span className="font-black text-green-700 text-sm">{cuponUsado}</span>
                        <span className="text-green-600 font-bold text-sm">(-{descuentoAplicado}%)</span>
                      </div>
                      <button onClick={handleEliminarCupon} title={locale === 'en' ? 'Remove coupon' : 'Eliminar cupón'}>
                        <XCircleIcon className="h-5 w-5 text-green-600 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder={locale === 'en' ? 'Enter your coupon' : 'Ingresa tu cupón'}
                        value={codigoCupon}
                        onChange={(e) => setCodigoCupon(e.target.value)}
                        className="grow px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 font-bold text-sm"
                      />
                      <button
                        onClick={handleAplicarCupon}
                        className="bg-gray-900 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-black text-sm transition-colors whitespace-nowrap"
                      >
                        {t('apply')}
                      </button>
                    </div>
                  )}

                  {!cuponUsado && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-gray-500 mb-2">{t('couponsAvailable')}</p>
                      <div className="flex flex-wrap gap-2">
                        {cupones.map((cupon) => (
                          <button
                            key={cupon.codigo}
                            onClick={() => setCodigoCupon(cupon.codigo)}
                            className="text-xs font-bold text-orange-500 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-300 rounded-full px-3 py-1 transition-colors"
                          >
                            {cupon.codigo}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Totales */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-bold">{t('subtotal')}</span>
                    <span className="text-gray-900 font-black">
                      ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-bold">{t('iva')}</span>
                    <span className="text-gray-900 font-black">
                      ${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {descuentoAplicado > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-bold">{t('discount')} ({descuentoAplicado}%)</span>
                      <span className="font-black">
                        -${descuento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="text-lg font-black text-gray-900">{t('total')}</span>
                    <span className="text-lg font-black text-orange-600">
                      ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Botón de pago */}
                <button
                  onClick={handleProcederPago}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl mt-6 transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
                >
                  {t('checkout')}
                </button>

                <p className="text-xs text-gray-400 text-center mt-4 font-medium">
                  {t('taxNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CarritoPage;