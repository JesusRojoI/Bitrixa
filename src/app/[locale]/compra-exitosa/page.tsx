'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useTranslations, useLocale } from 'next-intl';

interface OrdenData {
  orderId: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  iva: number;
  descuento: number;
  descuentoPorcentaje: number;
  total: number;
  last4: string;
  direccion: string;
  ciudad: string;
  estado: string;
  cp: string;
  fecha: string;
}

const CompraExitosaPage = () => {
  const t = useTranslations('success');
  const ct = useTranslations('cart');
  const locale = useLocale();
  const router = useRouter();
  const [orden, setOrden] = useState<OrdenData | null>(null);

  useEffect(() => {
    const ordenGuardada = localStorage.getItem('bitrixa-ultima-orden');
    if (ordenGuardada) {
      try {
        const data: OrdenData = JSON.parse(ordenGuardada);
        setOrden(data);
        localStorage.removeItem('bitrixa-ultima-orden');
      } catch (error) {
        console.error('Error al leer datos de la orden');
      }
    }
  }, []);

  if (!orden) {
    return (
      <main className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            {locale === 'en' ? 'Order not found' : 'No se encontró la orden'}
          </h1>
          <p className="text-gray-700 font-bold mb-8">
            {locale === 'en'
              ? 'You may have already viewed this page or there is no recent purchase.'
              : 'Es posible que ya hayas visto esta página o que no haya una compra reciente.'}
          </p>
          <a href={`/${locale}`} className="inline-flex items-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 shadow-xl">
            {t('backHome')}
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <CheckCircleIcon className="h-20 w-20 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-4">
            {t('title')}
          </h1>
          <p className="text-xl font-bold opacity-90">
            {t('thanks')}, {orden.customerName}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Detalles de la orden */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">{t('orderDetails')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-gray-500">{t('orderId')}</p>
                <p className="text-lg font-black text-gray-900">{orden.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">{t('transactionId')}</p>
                <p className="text-lg font-black text-gray-900">{orden.transactionId}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">{t('date')}</p>
                <p className="text-lg font-black text-gray-900">
                  {new Date(orden.fecha).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-MX', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">{t('card')}</p>
                <p className="text-lg font-black text-gray-900">**** **** **** {orden.last4}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-bold text-gray-500">{t('address')}</p>
                <p className="text-lg font-black text-gray-900">
                  {orden.direccion}, {orden.ciudad}, {orden.estado}, CP {orden.cp}
                </p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">{t('products')}</h2>
            <div className="space-y-3">
              {orden.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-black text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 font-bold">{t('quantity')}: {item.quantity}</p>
                  </div>
                  <p className="font-black text-gray-900">
                    ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">{t('paymentSummary')}</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700 font-bold">{ct('subtotal')}</span>
                <span className="text-gray-900 font-black">
                  ${orden.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-bold">{ct('iva')}</span>
                <span className="text-gray-900 font-black">
                  ${orden.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {orden.descuento > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-bold">{ct('discount')} ({orden.descuentoPorcentaje}%)</span>
                  <span className="font-black">
                    -${orden.descuento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-lg font-black text-gray-900">{ct('total')}</span>
                <span className="text-lg font-black text-orange-600">
                  ${orden.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Email de confirmación */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 mb-8 text-center">
            <p className="text-blue-800 font-bold">
              {t('emailSent')} <span className="font-black">{orden.customerEmail}</span>
            </p>
            <p className="text-blue-600 text-sm font-medium mt-1">{t('checkSpam')}</p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}`}
              className="inline-flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 shadow-xl"
            >
              {t('backHome')}
            </a>
            <a
              href={`/${locale}/alternativas`}
              className="inline-flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 shadow-xl"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              <span>{t('continueShopping')}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CompraExitosaPage;