'use client';
import React, { useState } from 'react';
import { PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

const ContactForm = () => {
  const t = useTranslations('contact.form');
  const locale = useLocale();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('errors.nameRequired');
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t('errors.nameMin');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('errors.phoneRequired');
    } else if (!/^[\d\s\-\+\(\)]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = t('errors.phoneInvalid');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('errors.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('errors.messageMin');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    if (isSuccess) {
      setIsSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('errors.messageRequired'), {
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fca5a5',
          fontWeight: 'bold'
        }
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale, // Enviar locale para emails en el idioma correcto
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
        setErrors({});
        
        toast.success(t('success'), {
          duration: 5000,
          icon: '✅',
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #86efac',
            fontWeight: 'bold'
          }
        });

        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } else {
        toast.error(data.error || 'Error', {
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fca5a5',
            fontWeight: 'bold'
          }
        });
      }
    } catch (error) {
      toast.error('Error de conexión', {
        style: {
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fca5a5',
          fontWeight: 'bold'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-gray-300 relative overflow-hidden">
      {/* Mensaje de éxito */}
      {isSuccess && (
        <div className="absolute inset-0 bg-white z-10 flex items-center justify-center rounded-3xl">
          <div className="text-center p-8">
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
            <h4 className="text-2xl font-black text-gray-900 mb-2">{t('success')}</h4>
            <p className="text-gray-700 font-bold">
              {t('successMessage')}
            </p>
          </div>
        </div>
      )}

      <div className="relative z-0">
        {/* Encabezado del formulario */}
        <div className="mb-8">
          <h3 className="text-3xl font-black text-gray-900 mb-3 flex items-center space-x-3">
            <span>{t('title')}</span>
            <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
          </h3>
          <p className="text-gray-800 leading-relaxed font-bold">
            {t('description')}
          </p>
        </div>

        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-black text-gray-900 mb-2">
              {t('name')} <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                id="name"
                placeholder={t('namePlaceholder')}
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-400 font-bold ${
                  errors.name 
                    ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 font-bold flex items-center space-x-1">
                  <span>⚠</span>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-black text-gray-900 mb-2">
              {t('phone')} <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder={t('phonePlaceholder')}
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-400 font-bold ${
                  errors.phone 
                    ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 font-bold flex items-center space-x-1">
                  <span>⚠</span>
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-black text-gray-900 mb-2">
              {t('email')} <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-400 font-bold ${
                  errors.email 
                    ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 font-bold flex items-center space-x-1">
                  <span>⚠</span>
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Mensaje */}
          <div className="md:col-span-2">
            <label htmlFor="message" className="block text-sm font-black text-gray-900 mb-2">
              {t('message')} <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <textarea
                name="message"
                id="message"
                rows={5}
                placeholder={t('messagePlaceholder')}
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-400 font-bold resize-none ${
                  errors.message 
                    ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600 font-bold flex items-center space-x-1">
                  <span>⚠</span>
                  <span>{errors.message}</span>
                </p>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs font-bold text-gray-700">
                {t('required')}
              </p>
              <p className="text-xs font-bold text-gray-500">
                {formData.message.length} {t('characters')}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de envío y texto de privacidad */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group inline-flex items-center justify-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto whitespace-nowrap"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t('sending')}</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>{t('submit')}</span>
              </>
            )}
          </button>

          <p className="text-xs font-bold text-gray-600 text-center sm:text-right leading-relaxed">
            {t('privacy')}
          </p>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;