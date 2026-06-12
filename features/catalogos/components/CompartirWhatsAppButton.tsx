'use client';

import { Button } from '@/components/ui/button';
import { generarLinkWhatsApp } from '@/lib/whatsapp/generarLinkWhatsApp'

interface CompartirWhatsAppButtonProps {
  pdfUrl: string;
  nombreCliente: string;
}

export function CompartirWhatsAppButton({
  pdfUrl,
  nombreCliente,
}: CompartirWhatsAppButtonProps) {
  const handleClick = () => {
    const link = generarLinkWhatsApp(
      pdfUrl,
      nombreCliente
    );

    window.open(link, '_blank');
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
    >
      Compartir WhatsApp
    </Button>
  );
}