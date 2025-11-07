import type { NotificationResult } from '../../work/interfaces/work.interfaces';

/**
 * Tipo de severidad para notificaciones
 */
export type NotificationSeverity = 'success' | 'warning' | 'error' | 'info';

/**
 * Resultado de interpretar una notificación
 */
export interface InterpretedNotification {
  severity: NotificationSeverity;
  message: string;
  shouldShowToast: boolean;
  details?: string;
}

/**
 * Interpreta el resultado de una notificación del backend y devuelve
 * información sobre cómo mostrarla al usuario.
 *
 * Lógica de interpretación:
 * 1. Si `sent: true` → Éxito, notificación enviada correctamente
 * 2. Si `enqueuedForRetry: true` → Advertencia, encolado para reintentos
 * 3. Si `reason` existe → Información, usuario sin configurar WhatsApp/teléfono
 * 4. Si ninguno de los anteriores → Error, fallo definitivo
 *
 * @param notification - Resultado de la notificación del backend
 * @param actionContext - Contexto de la acción (ej: "Tarea creada", "Tarea actualizada")
 * @returns Objeto con severity, message y shouldShowToast
 *
 * @example
 * ```typescript
 * const result = interpretNotificationResult(notificationResult, "Tarea creada");
 * if (result.shouldShowToast) {
 *   showToast(result.message, result.severity);
 * }
 * ```
 */
export const interpretNotificationResult = (
  notification: NotificationResult | undefined,
  actionContext: string = 'Tarea'
): InterpretedNotification => {
  // Si no hay notificación, no mostrar nada
  if (!notification) {
    return {
      severity: 'info',
      message: '',
      shouldShowToast: false
    };
  }

  // 1️⃣ Caso: Notificación enviada exitosamente
  if (notification.sent) {
    const userName = notification.user ? ` a ${notification.user}` : '';
    return {
      severity: 'success',
      message: `${actionContext} y notificación enviada${userName}`,
      shouldShowToast: true,
      details: notification.whatsapp?.messageSid
        ? `SID: ${notification.whatsapp.messageSid}`
        : undefined
    };
  }

  // 2️⃣ Caso: Encolado para reintentos automáticos
  if (notification.enqueuedForRetry) {
    return {
      severity: 'warning',
      message: `${actionContext}. Notificación será enviada en breve`,
      shouldShowToast: true,
      details: 'El mensaje ha sido encolado para reintentos automáticos'
    };
  }

  // 3️⃣ Caso: Usuario sin WhatsApp/teléfono configurado
  if (notification.reason) {
    return {
      severity: 'info',
      message: `${actionContext}. ${notification.reason}`,
      shouldShowToast: true,
      details: 'Configura WhatsApp o teléfono en el perfil del usuario'
    };
  }

  // 4️⃣ Caso: Error definitivo sin posibilidad de reintento
  const errorMessage = notification.error || notification.whatsapp?.errorMessage || 'Error desconocido';
  return {
    severity: 'error',
    message: `${actionContext} pero notificación falló`,
    shouldShowToast: true,
    details: errorMessage
  };
};

/**
 * Obtiene un mensaje corto para mostrar en toasts globales
 *
 * @param notification - Resultado de la notificación
 * @returns Mensaje corto para toast
 */
export const getNotificationToastMessage = (
  notification: NotificationResult | undefined
): string => {
  if (!notification) return '';

  if (notification.sent) {
    return 'Notificación enviada';
  }

  if (notification.enqueuedForRetry) {
    return 'Notificación en cola de envío';
  }

  if (notification.reason) {
    return 'Usuario sin WhatsApp configurado';
  }

  return 'Error al enviar notificación';
};

/**
 * Determina si la notificación representa un éxito
 * (útil para lógica condicional)
 *
 * @param notification - Resultado de la notificación
 * @returns true si la notificación fue exitosa o está en proceso
 */
export const isNotificationSuccessful = (
  notification: NotificationResult | undefined
): boolean => {
  if (!notification) return false;
  return notification.sent || notification.enqueuedForRetry || false;
};
