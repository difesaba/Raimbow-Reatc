// Export main page component
export { UsersManagementPage } from './pages/UsersManagementPage';

// Export routes
export { UsersRoutes, usersRoute } from './router/users.routes';

// Export hooks
export { useUsers } from './hooks/useUsers';
export { useUserFilters } from './hooks/useUserFilters';

// Export services
export { UserService } from './services/user.service';

// Export interfaces
export type {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserFilters,
  UserStatistics,
  Role,
  Company
} from './interfaces/user.interfaces';

// Export components
export { UsersTable } from './components/UsersTable';
export { UsersFilters } from './components/UsersFilters';
export { DeleteUserDialog } from './components/DeleteUserDialog';