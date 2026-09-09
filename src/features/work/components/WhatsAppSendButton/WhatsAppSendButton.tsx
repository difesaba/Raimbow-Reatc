import { Button, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { WhatsApp } from '@mui/icons-material';
import { buildWhatsAppUrl, normalizeWhatsAppPhone } from '../../utils/whatsapp.utils';
import type { WhatsAppSendButtonProps } from './WhatsAppSendButton.types';

/**
 * 📱 WhatsAppSendButton
 *
 * Abre WhatsApp Web (escritorio) o la app de WhatsApp (móvil) con el
 * destinatario y el mensaje pre-cargados, listo para enviar manualmente.
 */
export const WhatsAppSendButton = ({
  phone,
  message,
  disabled = false,
  label = 'Enviar por WhatsApp',
  size = 'small',
  variant = 'contained',
  fullWidth = false
}: WhatsAppSendButtonProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const normalizedPhone = normalizeWhatsAppPhone(phone);
  const hasMessage = !!message && message.trim() !== '';

  const handleClick = () => {
    if (!hasMessage) return;

    const url = buildWhatsAppUrl({ phone, message, isMobile });
    console.log('📱 Abriendo WhatsApp:', { phone, normalizedPhone, isMobile, url });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const tooltipTitle = !hasMessage
    ? 'No hay mensaje disponible para enviar'
    : normalizedPhone
      ? `Abrir WhatsApp con el mensaje para +${normalizedPhone}`
      : 'Abrir WhatsApp con el mensaje (elige el contacto manualmente)';

  return (
    <Tooltip title={tooltipTitle}>
      <span>
        <Button
          onClick={handleClick}
          disabled={disabled || !hasMessage}
          startIcon={<WhatsApp />}
          color="success"
          variant={variant}
          size={size}
          fullWidth={fullWidth}
        >
          {label}
        </Button>
      </span>
    </Tooltip>
  );
};
