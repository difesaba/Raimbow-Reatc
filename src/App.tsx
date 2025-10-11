import { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { cvhomesLightTheme } from './config/theme/cvhomes-light-theme';
import { router } from './config/router';
import { useAuthStore } from './features/auth/store/authStore';
import { NotificationProvider } from './features/shared/contexts';

// Import Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/600.css';
import '@fontsource/roboto/700.css';

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Restaurar estado de autenticación desde localStorage al iniciar la app
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ThemeProvider theme={cvhomesLightTheme}>
      <CssBaseline />
      <NotificationProvider maxNotifications={3}>
        <RouterProvider router={router} />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
