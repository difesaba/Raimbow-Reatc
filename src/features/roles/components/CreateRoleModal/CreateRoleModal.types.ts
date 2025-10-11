/**
 * 📋 Props para el componente CreateRoleModal
 */
export interface CreateRoleModalProps {
  /** Si el modal está abierto */
  open: boolean;

  /** Callback para cerrar el modal */
  onClose: () => void;

  /** Callback cuando se crea exitosamente un rol */
  onSuccess?: () => void;

  /** Estado de carga desde el componente padre */
  loading?: boolean;
}
