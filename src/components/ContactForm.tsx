'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        toast.error('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      toast.error('Error de red. Revisa tu conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-3xl font-bold text-warm-dark mb-6 text-center">Escríbenos</h3>
      <p className="text-center text-gray-600 mb-6">
        En Bitrixa valoramos la transparencia, la calidad y el compromiso, garantizando que cada servicio entregue valor real y medible a tu empresa.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-bitrixa-orange-500 focus:border-bitrixa-orange-500" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-bitrixa-orange-500 focus:border-bitrixa-orange-500" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-bitrixa-orange-500 focus:border-bitrixa-orange-500" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
          <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-bitrixa-orange-500 focus:border-bitrixa-orange-500" />
        </div>
      </div>
      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-bitrixa-orange-500 hover:bg-bitrixa-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bitrixa-orange-500 disabled:opacity-50 transition-colors duration-200"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;