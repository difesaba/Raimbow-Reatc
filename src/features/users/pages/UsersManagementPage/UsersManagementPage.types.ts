/**
 * Types specific to the UsersManagementPage component
 */
export interface UsersManagementPageState {
  isFormDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  formMode: 'create' | 'edit';
  selectedUser: User | null;
}

import type { User } from '../../interfaces/user.interfaces';