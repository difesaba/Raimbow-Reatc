/**
 * 📱 Utilidades para construir enlaces de WhatsApp
 *
 * Permite abrir WhatsApp Web (escritorio) o la app (móvil) con un
 * destinatario y un mensaje pre-cargado, para reenviar manualmente la
 * notificación de asignación de tarea cuando el envío automático falló
 * o cuando se quiere confirmar el mensaje con el manager.
 */

/**
 * Normaliza un teléfono al formato que exige la API de wa.me / WhatsApp Web:
 * únicamente dígitos, con código de país y sin el símbolo `+`.
 *
 * Acepta formatos como:
 * - "+1 304 520 7634"
 * - "whatsapp:+13045207634"
 * - "(304) 520-7634"
 *
 * @returns El teléfono normalizado o `null` si no es utilizable
 */
export const normalizeWhatsAppPhone = (phone: string | null | undefined): string | null => {
  if (!phone) return null;

  // Quitar el prefijo de canal que usa Twilio ("whatsapp:+1304...")
  const withoutChannel = phone.replace(/^whatsapp:/i, '');

  // Dejar solo dígitos
  const digits = withoutChannel.replace(/\D/g, '');

  // Un número internacional válido tiene entre 8 y 15 dígitos (E.164)
  if (digits.length < 8 || digits.length > 15) {
    return null;
  }

  return digits;
};

/**
 * Construye la URL para abrir WhatsApp con un mensaje pre-cargado.
 *
 * - Escritorio: `web.whatsapp.com` (WhatsApp Web)
 * - Móvil: `wa.me` (abre la app nativa si está instalada)
 *
 * Si no hay teléfono, se abre WhatsApp con el mensaje pero sin destinatario,
 * para que el usuario elija el contacto manualmente.
 */
export const buildWhatsAppUrl = ({
  phone,
  message,
  isMobile = false
}: {
  phone: string | null | undefined;
  message: string;
  isMobile?: boolean;
}): string => {
  const normalizedPhone = normalizeWhatsAppPhone(phone);
  const encodedMessage = encodeURIComponent(message);

  if (isMobile) {
    return normalizedPhone
      ? `https://wa.me/${normalizedPhone}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
  }

  return normalizedPhone
    ? `https://web.whatsapp.com/send?phone=${normalizedPhone}&text=${encodedMessage}`
    : `https://web.whatsapp.com/send?text=${encodedMessage}`;
};

/**
 * ¿El mensaje viene con los emojis corrompidos?
 *
 * El SP `[ACCESS].[GetWhatsAppMessages]` hace UNION ALL entre
 * `[ACCESS].[WhatsAppQueue].Message` (NVARCHAR, emojis intactos) y
 * `[ACCESS].[WhatsAppMessageLog].Body` (TEXT, no Unicode → emojis como "??").
 * Con esto detectamos la copia dañada para poder preferir la sana.
 */
export const hasBrokenEmojis = (message: string | null | undefined): boolean =>
  !!message && /\?\?/.test(message);

/**
 * 🩹 Emojis por etiqueta del mensaje de asignación.
 *
 * WORKAROUND: el backend guarda el mensaje en una columna no-Unicode, así que
 * cada emoji (par subrogado) se persiste como "??" y llega roto al front.
 * Mientras se corrige en el backend, reconstruimos el emoji a partir de la
 * etiqueta que acompaña cada línea.
 *
 * Las claves van sin tildes y en minúscula (ver `stripAccents`).
 */
const EMOJI_BY_LABEL: Record<string, string> = {
  fecha: '📅',
  trabajo: '🔨',
  cliente: '🏢',
  lote: '🏠',
  direccion: '📍',
  colores: '🎨',
  puerta: '🚪',
  stain: '🪵',
  observacion: '📝',
  observaciones: '📝'
};

/**
 * Quita tildes y pasa a minúscula, para comparar etiquetas de forma tolerante
 */
const COMBINING_MARKS = /[̀-ͯ]/g;

const stripAccents = (text: string): string =>
  text.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase();

/**
 * 🩹 Restaura los emojis perdidos en el mensaje que devuelve el backend.
 *
 * - `?? Fecha: ...`   → `📅 Fecha: ...`
 * - `Hola Diego ??`   → `Hola Diego 👋`
 * - Cualquier `??` sin etiqueta conocida se elimina en lugar de mostrarse roto.
 *
 * Si el mensaje ya trae los emojis correctos, la función no lo modifica.
 */
export const restoreMessageEmojis = (message: string): string => {
  if (!message) return message;

  return message
    .split('\n')
    .map(line => {
      // Línea con etiqueta: "?? Trabajo: *Stain Stairs*"
      const labelMatch = line.match(/^(\s*)\?{1,4}\s*([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)\s*:/);
      if (labelMatch) {
        const emoji = EMOJI_BY_LABEL[stripAccents(labelMatch[2])];
        return emoji
          ? line.replace(/^(\s*)\?{1,4}\s*/, `$1${emoji} `)
          : line.replace(/^(\s*)\?{1,4}\s*/, '$1');
      }

      // Saludo: "Hola Diego Sánchez ??"
      if (/^\s*hola\b/i.test(line)) {
        return line.replace(/\s*\?{2,4}\s*$/, ' 👋');
      }

      // Cualquier otro "??" suelto: se elimina (un "?" simple se respeta, es puntuación)
      return line.replace(/\?{2,4}/g, '').replace(/[ \t]+$/, '');
    })
    .join('\n');
};

/**
 * Datos mínimos necesarios para armar el mensaje de respaldo
 */
export interface TaskMessageData {
  managerName?: string;
  workName?: string;
  lotNumber?: string;
  clientName?: string;
  address?: string;
  startDate?: string; // dd/MM/yyyy o YYYY-MM-DD
  endDate?: string;
  observations?: string;
}

/**
 * Formatea una fecha (YYYY-MM-DD o ISO) a dd/MM/yyyy sin conversión de zona horaria.
 * Si el valor ya viene en dd/MM/yyyy se devuelve tal cual.
 */
const formatDateForMessage = (date: string | undefined): string | null => {
  if (!date || date.trim() === '') return null;

  // Ya viene como dd/MM/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date;

  const [datePart] = date.split('T');
  const parts = datePart.split('-');
  if (parts.length !== 3) return date;

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

/**
 * Mensaje de respaldo, usado cuando no se puede recuperar el mensaje real
 * que generó el backend. Replica la información clave de la asignación.
 */
export const buildTaskAssignmentMessage = (data: TaskMessageData): string => {
  const lines: string[] = ['🛠️ *Asignación de tarea*', ''];

  if (data.managerName) lines.push(`👤 Manager: ${data.managerName}`);
  if (data.workName) lines.push(`📋 Trabajo: ${data.workName}`);
  if (data.lotNumber) lines.push(`🏠 Lote: ${data.lotNumber}`);
  if (data.clientName) lines.push(`🏢 Cliente: ${data.clientName}`);
  if (data.address) lines.push(`📍 Dirección: ${data.address}`);

  const start = formatDateForMessage(data.startDate);
  const end = formatDateForMessage(data.endDate);
  if (start) lines.push(`📅 Inicio: ${start}`);
  if (end) lines.push(`🏁 Fin: ${end}`);

  if (data.observations && data.observations.trim() !== '') {
    lines.push('', `📝 Observaciones: ${data.observations.trim()}`);
  }

  return lines.join('\n');
};
