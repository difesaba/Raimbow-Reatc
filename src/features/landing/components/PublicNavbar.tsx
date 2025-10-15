// src/features/landing/components/PublicNavbar.tsx
import { AppBar, Toolbar, Box, Button, Container } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleEmployeePortal = () => {
    navigate('/portal');
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box
            component="img"
            src="/assets/images/logo.jpeg"
            alt="Rainbow Painting LLC"
            sx={{
              height: { xs: 50, md: 60 },
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          {/* Employee Portal Button */}
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={handleEmployeePortal}
            sx={{
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Employee Portal
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
