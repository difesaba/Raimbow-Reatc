/**
 * useNotification Hook
 * Provides access to the notification system
 */

import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

/**
 * Custom hook to access notification functionality
 * @throws {Error} If used outside NotificationProvider
 * @returns Notification methods
 *
 * @example
 * ```tsx
 * const { showSuccess, showError } = useNotification();
 *
 * // Show success notification
 * showSuccess('Operación exitosa');
 *
 * // Show error notification
 * showError('Ocurrió un error');
 *
 * // Show custom notification
 * showNotification({
 *   message: 'Mensaje personalizado',
 *   severity: 'warning',
 *   duration: 3000
 * });
 * ```
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification debe ser usado dentro de un NotificationProvider. ' +
      'Asegúrate de envolver tu aplicación con <NotificationProvider>.'
    );
  }

  return context;
};
