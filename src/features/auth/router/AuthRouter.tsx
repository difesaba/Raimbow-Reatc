/**
 * Authentication Routes Configuration
 *
 * USAGE:
 * Import and add to your main router configuration
 */

import { Routes, Route } from 'react-router-dom';
import { LoginMUI } from '../components/LoginExample';
import { GuestRoute } from '../components/ProtectedRoute';

// Import your actual login page when ready
// import { LoginPage } from '../pages/LoginPage';

/**
 * Authentication routes component
 */
export const AuthRouter = () => {
  return (
    <Routes>
      {/* Login Route - only accessible when NOT authenticated */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginMUI />
            {/* Replace with your actual login page: */}
            {/* <LoginPage /> */}
          </GuestRoute>
        }
      />

      {/* Additional auth routes can be added here */}
      {/* <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} /> */}
      {/* <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} /> */}
      {/* <Route path="/reset-password/:token" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} /> */}
    </Routes>
  );
};

/**
 * Route configuration for use with React Router
 */
export const authRoutes = [
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginMUI />
      </GuestRoute>
    )
  }
  // Add more auth routes as needed
];