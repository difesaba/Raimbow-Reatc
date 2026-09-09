import type { ButtonProps } from '@mui/material';

export interface WhatsAppSendButtonProps {
  /** Teléfono del destinatario (acepta "+1304...", "whatsapp:+1304...", etc.) */
  phone: string | null | undefined;
  /** Mensaje que se pre-carga en WhatsApp */
  message: string;
  /** Deshabilita el botón (por ejemplo, mientras se resuelve el mensaje real) */
  disabled?: boolean;
  /** Texto del botón. Por defecto: "Enviar por WhatsApp" */
  label?: string;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  fullWidth?: boolean;
}
