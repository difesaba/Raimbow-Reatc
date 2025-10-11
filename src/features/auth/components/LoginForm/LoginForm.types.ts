// src/features/auth/components/LoginForm/LoginForm.types.ts

export interface LoginFormProps {
  /** Callback when form is submitted */
  onSubmit: (credentials: LoginCredentials) => void;

  /** Loading state during authentication */
  loading?: boolean;

  /** Error message to display */
  error?: string | null;

  /** Disable entire form */
  disabled?: boolean;

  /** Current email value */
  email?: string;

  /** Current password value */
  password?: string;

  /** Remember me checkbox state */
  rememberMe?: boolean;

  /** Password visibility state */
  showPassword?: boolean;

  /** Email field error message */
  emailError?: string;

  /** Password field error message */
  passwordError?: string;

  /** Email field is valid */
  emailValid?: boolean;

  /** Password field is valid */
  passwordValid?: boolean;

  /** Callback when email changes */
  onEmailChange?: (value: string) => void;

  /** Callback when password changes */
  onPasswordChange?: (value: string) => void;

  /** Callback when remember me changes */
  onRememberMeChange?: (checked: boolean) => void;

  /** Callback to toggle password visibility */
  onTogglePasswordVisibility?: () => void;

  /** Callback for forgot password link */
  onForgotPassword?: () => void;

  /** Callback for terms and conditions link */
  onTermsClick?: () => void;

  /** Callback for privacy policy link */
  onPrivacyClick?: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}