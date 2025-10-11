/**
 * Notification Context
 * Provides a global notification system using Material-UI Snackbar
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

/**
 * Notification configuration interface
 */
export interface NotificationConfig {
  /** Message to display */
  message: string;
  /** Severity/type of notification */
  severity?: AlertColor;
  /** Duration in milliseconds (default: 5000) */
  duration?: number;
  /** Optional action button */
  action?: ReactNode;
}

/**
 * Internal notification with unique ID
 */
interface Notification extends NotificationConfig {
  id: string;
  open: boolean;
}

/**
 * Context value interface
 */
interface NotificationContextValue {
  /** Show a notification */
  showNotification: (config: NotificationConfig) => void;
  /** Show success notification (shorthand) */
  showSuccess: (message: string, duration?: number) => void;
  /** Show error notification (shorthand) */
  showError: (message: string, duration?: number) => void;
  /** Show warning notification (shorthand) */
  showWarning: (message: string, duration?: number) => void;
  /** Show info notification (shorthand) */
  showInfo: (message: string, duration?: number) => void;
}

/**
 * Notification Context
 */
export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

/**
 * Global notification function (for use outside React components)
 * Will be set by NotificationProvider
 */
let globalShowNotification: ((config: NotificationConfig) => void) | null = null;

/**
 * Show notification from outside React components
 * Use this in axios interceptors, utility functions, etc.
 */
export const showGlobalNotification = (config: NotificationConfig) => {
  if (globalShowNotification) {
    globalShowNotification(config);
  } else {
    console.warn('[NotificationContext] Provider not initialized. Notification not shown:', config);
  }
};

/**
 * Shorthand functions for global notifications
 */
export const showGlobalSuccess = (message: string, duration?: number) => {
  showGlobalNotification({ message, severity: 'success', duration });
};

export const showGlobalError = (message: string, duration?: number) => {
  showGlobalNotification({ message, severity: 'error', duration });
};

export const showGlobalWarning = (message: string, duration?: number) => {
  showGlobalNotification({ message, severity: 'warning', duration });
};

export const showGlobalInfo = (message: string, duration?: number) => {
  showGlobalNotification({ message, severity: 'info', duration });
};

/**
 * Notification Provider Props
 */
interface NotificationProviderProps {
  children: ReactNode;
  /** Maximum number of notifications to show at once */
  maxNotifications?: number;
}

/**
 * Notification Provider Component
 * Manages notification state and display
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 1
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Generate unique notification ID
   */
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Show a notification
   */
  const showNotification = useCallback(
    (config: NotificationConfig) => {
      const id = generateId();
      const newNotification: Notification = {
        id,
        open: true,
        severity: config.severity || 'info',
        duration: config.duration || 5000,
        ...config
      };

      setNotifications((prev) => {
        // If max notifications reached, remove oldest
        const updated = [...prev, newNotification];
        if (updated.length > maxNotifications) {
          return updated.slice(-maxNotifications);
        }
        return updated;
      });
    },
    [generateId, maxNotifications]
  );

  /**
   * Close a notification
   */
  const handleClose = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, open: false } : notification
      )
    );

    // Remove from array after animation completes
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 300);
  }, []);

  /**
   * Shorthand methods
   */
  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showNotification({ message, severity: 'success', duration });
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showNotification({ message, severity: 'error', duration });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showNotification({ message, severity: 'warning', duration });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showNotification({ message, severity: 'info', duration });
    },
    [showNotification]
  );

  // Set global notification function on mount
  useEffect(() => {
    globalShowNotification = showNotification;
    return () => {
      globalShowNotification = null;
    };
  }, [showNotification]);

  const value: NotificationContextValue = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render notifications */}
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={notification.duration}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            // Stack notifications vertically
            top: `${24 + index * 70}px !important`
          }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
            action={notification.action}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};
