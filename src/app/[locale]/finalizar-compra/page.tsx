'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TagIcon, XCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
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

const FinalizarCompraPage = () => {
  const t = useTranslations('checkout');
  const ct = useTranslations('cart');
  const pt = useTranslations('productDetail');
  const locale = useLocale();
  const { items, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [mostrarCupon, setMostrarCupon] = useState(false);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [cuponUsado, setCuponUsado] = useState('');
  const [cuponPrevio, setCuponPrevio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nombres de productos traducidos
  const productNames = pt.raw('items') as Array<{ name: string }>;

  const getTranslatedName = (itemId: string, fallbackName: string) => {
    const productoData = productos.find(p => p.id === itemId);
    if (productoData) {
      return productNames[productoData.translationIndex]?.name || fallbackName;
    }
    return fallbackName;
  };

  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [pais, setPais] = useState('México');
  const [direccion, setDireccion] = useState('');
  const [colonia, setColonia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [estado, setEstado] = useState('Ciudad de México');
  const [cp, setCp] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    const cuponGuardado = localStorage.getItem('bitrixa-cupon');
    if (cuponGuardado) {
      try {
        const cupon: CuponGuardado = JSON.parse(cuponGuardado);
        setDescuentoAplicado(cupon.descuento);
        setCuponUsado(cupon.codigo);
        setCuponPrevio(true);
      } catch (error) {
        console.error('Error al leer cupón guardado');
      }
    }
  }, []);

  const subtotal = getCartTotal();
  const iva = subtotal * 0.16;
  const descuento = (subtotal * descuentoAplicado) / 100;
  const total = subtotal + iva - descuento;

  const validarFormulario = (): string | null => {
    if (!nombre.trim()) return locale === 'en' ? 'First name is required' : 'El nombre es requerido';
    if (!apellidos.trim()) return locale === 'en' ? 'Last name is required' : 'Los apellidos son requeridos';
    if (!direccion.trim()) return locale === 'en' ? 'Address is required' : 'La dirección es requerida';
    if (!ciudad.trim()) return locale === 'en' ? 'City is required' : 'La ciudad es requerida';
    if (!cp.trim()) return locale === 'en' ? 'ZIP code is required' : 'El código postal es requerido';
    if (!/^\d{5}$/.test(cp.trim())) return locale === 'en' ? 'ZIP code must be 5 digits' : 'El código postal debe tener 5 dígitos';
    if (!email.trim()) return locale === 'en' ? 'Email is required' : 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return locale === 'en' ? 'Enter a valid email' : 'Ingresa un email válido';
    if (!nombreTarjeta.trim()) return locale === 'en' ? 'Cardholder name is required' : 'El nombre del titular es requerido';
    if (!numeroTarjeta.trim()) return locale === 'en' ? 'Card number is required' : 'El número de tarjeta es requerido';
    if (!/^\d{16}$/.test(numeroTarjeta.replace(/\s/g, ''))) return locale === 'en' ? 'Card number must be 16 digits' : 'El número de tarjeta debe tener 16 dígitos';
    if (!fechaExpiracion.trim()) return locale === 'en' ? 'Expiration date is required' : 'La fecha de expiración es requerida';
    if (!/^\d{2}\/\d{2}$/.test(fechaExpiracion.trim())) return locale === 'en' ? 'Invalid date format (MM/YY)' : 'Formato de fecha inválido (MM/YY)';
    if (!cvv.trim()) return locale === 'en' ? 'CVV is required' : 'El CVV es requerido';
    if (!/^\d{3,4}$/.test(cvv.trim())) return locale === 'en' ? 'CVV must be 3 or 4 digits' : 'El CVV debe tener 3 o 4 dígitos';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validarFormulario();
    if (error) {
      toast.error(error, {
        style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' },
      });
      return;
    }

    setIsSubmitting(true);
    const orderId = `BTX-${Date.now().toString(36).toUpperCase()}`;

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          orderId,
          customerName: `${nombre} ${apellidos}`,
          customerEmail: email,
          cardData: {
            nombreTarjeta,
            numeroTarjeta: numeroTarjeta.replace(/\s/g, ''),
            fechaExpiracion,
            cvv,
          },
          shippingData: {
            direccion: `${direccion}${colonia ? ', ' + colonia : ''}`,
            ciudad,
            estado,
            cp,
            telefono,
          },
          items: items.map((item) => ({
            name: getTranslatedName(item.id, item.name),
            quantity: item.quantity,
            price: item.price,
          })),
          descuentoAplicado,
          descuentoPorcentaje: descuentoAplicado,
          locale,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const ordenData = {
          orderId,
          transactionId: data.data.transactionId,
          customerName: `${nombre} ${apellidos}`,
          customerEmail: email,
          items: items.map((item) => ({
            name: getTranslatedName(item.id, item.name),
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          iva,
          descuento,
          descuentoPorcentaje: descuentoAplicado,
          total,
          last4: data.data.last4,
          direccion: `${direccion}${colonia ? ', ' + colonia : ''}`,
          ciudad,
          estado,
          cp,
          fecha: new Date().toISOString(),
        };

        localStorage.setItem('bitrixa-ultima-orden', JSON.stringify(ordenData));
        localStorage.removeItem('bitrixa-cupon');
        clearCart();

        toast.success(
          locale === 'en' ? 'Payment processed successfully!' : '¡Pago procesado con éxito!',
          {
            icon: '🎉',
            duration: 3000,
            style: { background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', fontWeight: 'bold' },
          }
        );

        setTimeout(() => {
          router.push(`/${locale}/compra-exitosa`);
        }, 1500);
      } else {
        toast.error(data.error || (locale === 'en' ? 'Payment error' : 'Error al procesar el pago'), {
          style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' },
        });
      }
    } catch (error) {
      toast.error(locale === 'en' ? 'Connection error. Try again.' : 'Error de conexión. Intenta de nuevo.', {
        style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAplicarCupon = () => {
    if (cuponUsado) {
      toast.error(locale === 'en' ? 'You already have a coupon applied' : 'Ya tienes un cupón aplicado', {
        style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' },
      });
      return;
    }
    const cuponEncontrado = cupones.find((c) => c.codigo.toLowerCase() === codigoCupon.trim().toLowerCase());
    if (cuponEncontrado) {
      setDescuentoAplicado(cuponEncontrado.descuento);
      setCuponUsado(cuponEncontrado.codigo);
      setCuponPrevio(true);
      localStorage.setItem('bitrixa-cupon', JSON.stringify({ codigo: cuponEncontrado.codigo, descuento: cuponEncontrado.descuento }));
      toast.success(
        locale === 'en' ? `Coupon applied! ${cuponEncontrado.descuento}% discount` : `¡Cupón aplicado! ${cuponEncontrado.descuento}% de descuento`,
        { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', fontWeight: 'bold' } }
      );
    } else {
      toast.error(locale === 'en' ? 'Invalid coupon' : 'Cupón no válido', {
        style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontWeight: 'bold' },
      });
    }
  };

  const handleEliminarCupon = () => {
    setDescuentoAplicado(0);
    setCuponUsado('');
    setCodigoCupon('');
    setCuponPrevio(false);
    localStorage.removeItem('bitrixa-cupon');
    toast.success(locale === 'en' ? 'Coupon removed' : 'Cupón eliminado', {
      style: { background: '#fff7ed', color: '#9a3412', border: '1px solid #fdba74', fontWeight: 'bold' },
    });
  };

  if (items.length === 0) {
    return (
      <main className="bg-gray-100 min-h-screen">
        <section className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
              <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">Home</a>
              <span>/</span>
              <span className="text-orange-400">{t('title')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">{t('title')}</h1>
          </div>
        </section>
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl max-w-lg mx-auto border-2 border-gray-200">
              <h2 className="text-2xl font-black text-gray-900 mb-4">
                {locale === 'en' ? 'Your cart is empty' : 'Tu carrito está vacío'}
              </h2>
              <p className="text-gray-700 font-bold mb-8">
                {locale === 'en' ? 'Add products before checkout' : 'Agrega productos antes de finalizar la compra'}
              </p>
              <a href={`/${locale}/alternativas`} className="inline-flex items-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 shadow-xl">
                {locale === 'en' ? 'View alternatives' : 'Ver alternativas'}
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 mb-4">
            <a href={`/${locale}`} className="hover:text-orange-400 transition-colors">Home</a>
            <span>/</span>
            <span className="text-orange-400">{t('title')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider">{t('title')}</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario de facturación */}
              <div className="lg:col-span-2 space-y-8">
                {/* Cupón */}
                {!cuponPrevio && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                    <button type="button" onClick={() => setMostrarCupon(!mostrarCupon)} className="text-orange-500 font-black hover:text-orange-600 transition-colors">
                      {t('haveCoupon')}
                    </button>
                    {mostrarCupon && (
                      <div className="mt-4">
                        <label className="block text-sm font-black text-gray-900 mb-2">{t('coupon')}</label>
                        <div className="flex space-x-2">
                          <input type="text" placeholder={t('addCoupon')} value={codigoCupon} onChange={(e) => setCodigoCupon(e.target.value)} className="grow px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 font-bold text-sm" />
                          <button type="button" onClick={handleAplicarCupon} className="bg-gray-900 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-sm transition-colors">{t('addCoupon')}</button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {cupones.map((cupon) => (
                            <button key={cupon.codigo} type="button" onClick={() => setCodigoCupon(cupon.codigo)} className="text-xs font-bold text-orange-500 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-300 rounded-full px-3 py-1 transition-colors">
                              {cupon.codigo}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {cuponPrevio && cuponUsado && (
                  <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TagIcon className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-black text-green-800 text-sm">{t('couponApplied')}</p>
                          <p className="text-green-700 font-bold text-sm">{cuponUsado} (-{descuentoAplicado}%)</p>
                        </div>
                      </div>
                      <button type="button" onClick={handleEliminarCupon} className="text-green-600 hover:text-red-500 transition-colors">
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Detalles de facturación */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
                  <h2 className="text-xl font-black text-gray-900 mb-6">{t('billing')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('firstName')} *</label>
                      <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('lastName')} *</label>
                      <input type="text" required value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-bold" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('country')} *</label>
                      <select required value={pais} onChange={(e) => setPais(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-bold">
                        <option value="México">México</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('street')} *</label>
                      <input type="text" required placeholder={t('streetPlaceholder')} value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 font-bold" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('colonia')}</label>
                      <input type="text" placeholder={t('coloniaPlaceholder')} value={colonia} onChange={(e) => setColonia(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('city')} *</label>
                      <input type="text" required value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('state')} *</label>
                      <select required value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-bold">
                        <option value="Ciudad de México">Ciudad de México</option>
                        <option value="Estado de México">Estado de México</option>
                        <option value="Nuevo León">Nuevo León</option>
                        <option value="Jalisco">Jalisco</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('cp')} *</label>
                      <input type="text" required value={cp} onChange={(e) => setCp(e.target.value)} maxLength={5} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-bold" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('phone')}</label>
                      <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-bold" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('email')} *</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-bold" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black text-gray-900 mb-2">{t('additional')}</label>
                      <label className="block text-sm font-bold text-gray-600 mb-2">{t('additionalLabel')}</label>
                      <textarea rows={3} placeholder={t('additionalPlaceholder')} value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 font-bold resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 sticky top-24 space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 mb-4">{t('order')}</h2>
                    <div className="space-y-3">
                      {items.map((item) => {
                        const displayName = getTranslatedName(item.id, item.name);
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700 font-bold">{displayName} <span className="text-orange-500">× {item.quantity}</span></span>
                            <span className="text-gray-900 font-black">${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-bold">{ct('subtotal')}</span>
                      <span className="text-gray-900 font-black">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-bold">{ct('iva')}</span>
                      <span className="text-gray-900 font-black">${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {descuentoAplicado > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-bold">{ct('discount')} ({descuentoAplicado}%)</span>
                        <span className="font-black">-${descuento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <span className="text-lg font-black text-gray-900">{ct('total')}</span>
                      <span className="text-lg font-black text-orange-600">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center space-x-2"><LockClosedIcon className="h-5 w-5 text-green-500" /><span>{t('payment')}</span></h3>
                    <p className="text-sm font-bold text-gray-600 mb-4">{t('cardType')}</p>
                    <div className="space-y-4">
                      <div><label className="block text-sm font-black text-gray-900 mb-2">{t('cardName')}</label><input type="text" placeholder={t('cardNamePlaceholder')} value={nombreTarjeta} onChange={(e) => setNombreTarjeta(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 font-bold" /></div>
                      <div><label className="block text-sm font-black text-gray-900 mb-2">{t('cardNumber')}</label><input type="text" placeholder="**** **** **** ****" value={numeroTarjeta} onChange={(e) => setNumeroTarjeta(e.target.value)} maxLength={16} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 font-bold" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-black text-gray-900 mb-2">{t('cardExpiry')}</label><input type="text" placeholder={t('cardExpiryPlaceholder')} value={fechaExpiracion} onChange={(e) => setFechaExpiracion(e.target.value)} maxLength={5} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 font-bold" /></div>
                        <div><label className="block text-sm font-black text-gray-900 mb-2">{t('cvv')}</label><input type="text" placeholder={t('cvvPlaceholder')} value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={4} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 font-bold" /></div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-bold text-gray-500 mb-3">{t('securePayment')}</p>
                    <Image src="/octano_logo.png" alt="Octano Payments" width={140} height={45} className="mx-auto" style={{ filter: 'none' }} />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        <span>{t('processing')}</span>
                      </span>
                    ) : t('placeOrder')}
                  </button>

                  <p className="text-xs text-gray-500 text-center font-bold">{t('privacy')}</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default FinalizarCompraPage;