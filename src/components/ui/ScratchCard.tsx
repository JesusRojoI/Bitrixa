'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface ScratchCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ isOpen, onClose }) => {
  const t = useTranslations('scratch');
  const locale = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [cupon, setCupon] = useState('');
  const [copied, setCopied] = useState(false);

  // Generar cupón único al abrir
  useEffect(() => {
    if (isOpen) {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCupon(`BTX-${randomPart}`);
      setEmail('');
      setEmailSubmitted(false);
      setEmailError('');
      setRevealed(false);
      setCopied(false);
    }
  }, [isOpen]);

  // Inicializar canvas para rascar
  useEffect(() => {
    if (!emailSubmitted || !canvasRef.current || revealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fondo gris para rascar
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto decorativo
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      locale === 'en' ? 'Scratch here!' : '¡Rasca aquí!',
      canvas.width / 2,
      canvas.height / 2 + 6
    );

    let drawn = 0;
    const totalPixels = canvas.width * canvas.height;
    const threshold = totalPixels * 0.7;

    const scratch = (x: number, y: number) => {
      if (!ctx || revealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      drawn += Math.PI * 25 * 25;

      if (drawn >= threshold && !revealed) {
        setRevealed(true);
        // Guardar el cupón automáticamente al revelarse
        const codigoLimpio = cupon.trim();
        const cuponesGuardados = JSON.parse(localStorage.getItem('bitrixa-cupones-generados') || '[]');
        const existe = cuponesGuardados.find((c: any) => c.codigo === codigoLimpio);
        if (!existe) {
          cuponesGuardados.push({ codigo: codigoLimpio, descuento: 10, usado: false });
          localStorage.setItem('bitrixa-cupones-generados', JSON.stringify(cuponesGuardados));
        }
      }
    };

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const handleEnd = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [emailSubmitted, isDrawing, revealed, locale, cupon]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(locale === 'en' ? 'Enter a valid email' : 'Ingresa un email válido');
      return;
    }
    setEmailError('');
    setEmailSubmitted(true);
    localStorage.setItem('bitrixa-scratch-email', email);
  };

  const handleCopyCupon = () => {
    navigator.clipboard.writeText(cupon).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClaimAndClose = () => {
    // Guardar como cupón activo para uso inmediato
    const codigoLimpio = cupon.trim();
    localStorage.setItem('bitrixa-cupon', JSON.stringify({ codigo: codigoLimpio, descuento: 10 }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-black text-gray-900 text-center mb-2">
          {locale === 'en' ? '🎉 Scratch & Win!' : '🎉 ¡Rasca y Gana!'}
        </h2>
        <p className="text-gray-600 font-bold text-center text-sm mb-6">
          {locale === 'en'
            ? 'Scratch the gray area and discover your discount!'
            : '¡Rasca el área gris y descubre tu descuento!'}
        </p>

        {!emailSubmitted ? (
          /* Paso 1: Pedir email */
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2">
                {locale === 'en' ? 'Enter your email to participate' : 'Ingresa tu correo para participar'}
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder={locale === 'en' ? 'you@email.com' : 'tu@email.com'}
                  className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-400 font-bold ${
                    emailError
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 font-bold">{emailError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {locale === 'en' ? 'Start Scratching!' : '¡Empezar a rascar!'}
            </button>
          </form>
        ) : (
          /* Paso 2: Rascar */
          <div className="space-y-4">
            <div className="relative bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl p-6 text-center min-h-[120px] flex items-center justify-center overflow-hidden">
              {/* Premio revelado */}
              <div className={`transition-opacity duration-300 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-sm font-bold text-white mb-1">
                  {locale === 'en' ? 'Your coupon:' : 'Tu cupón:'}
                </p>
                <p className="text-3xl font-black text-white tracking-wider">{cupon}</p>
                <p className="text-lg font-bold text-white mt-1">10% OFF</p>
              </div>

              {/* Canvas para rascar */}
              {!revealed && (
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer touch-none"
                />
              )}
            </div>

            {revealed && (
              <div className="space-y-3">
                <button
                  onClick={handleCopyCupon}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black py-3 rounded-xl transition-all duration-300 shadow-lg"
                >
                  {copied
                    ? (locale === 'en' ? '✅ Copied!' : '✅ ¡Copiado!')
                    : (locale === 'en' ? '📋 Copy Coupon' : '📋 Copiar Cupón')}
                </button>
                <button
                  onClick={handleClaimAndClose}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {locale === 'en' ? 'Claim & Close' : 'Reclamar y Cerrar'}
                </button>
              </div>
            )}

            {!revealed && (
              <p className="text-xs text-gray-500 text-center font-medium">
                {locale === 'en'
                  ? 'Scratch with your mouse or finger!'
                  : '¡Rasca con tu mouse o dedo!'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScratchCard;