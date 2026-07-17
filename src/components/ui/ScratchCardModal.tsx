'use client';
import React, { useState, useEffect } from 'react';
import ScratchCard from './ScratchCard';

const ScratchCardModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Mostrar solo si no ha reclamado antes
    const hasClaimed = localStorage.getItem('bitrixa-scratch-claimed');
    if (!hasClaimed) {
      // Pequeño delay para que cargue la página primero
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('bitrixa-scratch-claimed', 'true');
  };

  return <ScratchCard isOpen={show} onClose={handleClose} />;
};

export default ScratchCardModal;