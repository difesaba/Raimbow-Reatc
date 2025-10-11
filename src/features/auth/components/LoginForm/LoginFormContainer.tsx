// src/features/auth/components/LoginForm/LoginFormContainer.tsx
import { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import type { LoginCredentials } from './LoginForm.types';

interface LoginFormContainerProps {
  onSubmit: (credentials: LoginCredentials) => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

/**
 * LoginFormContainer - Container component that manages state and business logic
 *
 * This container handles:
 * - Form state management
 * - Validation logic
 * - Event handlers
 *
 * The presentational LoginForm component receives all data via props
 */
export const LoginFormContainer: React.FC<LoginFormContainerProps> = ({
  onSubmit,
  loading = false,
  error = null,
  disabled = false,
}) => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Touched state for validation
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Real-time validation with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (touched.email) {
        validateField('email', email);
      }
      if (touched.password) {
        validateField('password', password);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [email, password, touched]);

  // Field validation
  const validateField = (field: 'email' | 'password', value: string) => {
    const errors = { ...validationErrors };

    if (field === 'email') {
      if (!value.trim()) {
        errors.email = 'Email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = 'Formato de email inválido';
      } else {
        delete errors.email;
      }
    }

    if (field === 'password') {
      if (!value.trim()) {
        errors.password = 'Contraseña es requerida';
      } else if (value.length < 6) {
        errors.password = 'Mínimo 6 caracteres';
      } else {
        delete errors.password;
      }
    }

    setValidationErrors(errors);
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Formato de email inválido';
    }

    if (!password.trim()) {
      errors.password = 'Contraseña es requerida';
    } else if (password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
    }

    setValidationErrors(errors);
    setTouched({ email: true, password: true });
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = (credentials: LoginCredentials) => {
    if (!validateForm()) {
      return;
    }
    onSubmit(credentials);
  };

  // Field change handlers
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!touched.email && value) {
      setTouched(prev => ({ ...prev, email: true }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!touched.password && value) {
      setTouched(prev => ({ ...prev, password: true }));
    }
  };

  // Check field validity
  const isEmailValid = touched.email && !validationErrors.email && email;
  const isPasswordValid = touched.password && !validationErrors.password && password;

  return (
    <LoginForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      disabled={disabled}
      email={email}
      password={password}
      rememberMe={rememberMe}
      showPassword={showPassword}
      emailError={touched.email ? validationErrors.email : undefined}
      passwordError={touched.password ? validationErrors.password : undefined}
      emailValid={!!isEmailValid}
      passwordValid={!!isPasswordValid}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onRememberMeChange={setRememberMe}
      onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
      onForgotPassword={() => console.log('Forgot password clicked')}
      onTermsClick={() => console.log('Terms clicked')}
      onPrivacyClick={() => console.log('Privacy clicked')}
    />
  );
};