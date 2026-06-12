'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generarLinkWhatsApp } from '@/lib/whatsapp/generarLinkWhatsApp';

interface CompartirWhatsAppButtonProps {
  pdfUrl: string;
  nombreCliente: string;
}

export function CompartirWhatsAppButton({
  pdfUrl,
  nombreCliente,
}: CompartirWhatsAppButtonProps) {
  const handleClick = () => {
    const link = generarLinkWhatsApp(pdfUrl, nombreCliente);
    window.open(link, '_blank');
  };

  return (
    <>
      {/* Móvil */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        title="Compartir por WhatsApp"
        className="h-8 w-8 hover:bg-green-50 md:hidden"
      >
        <MessageCircle
          size={14}
          style={{ color: '#25D366' }}
        />
      </Button>

      {/* Escritorio */}
      <Button
        type="button"
        onClick={handleClick}
        className="hidden md:flex bg-green-500 hover:bg-green-600 text-white"
      >
        <MessageCircle
          size={16}
          style={{ color: '#ffffff' }}
        />
        <span className="ml-2">
          Enviar por WhatsApp
        </span>
      </Button>
    </>
  );
}