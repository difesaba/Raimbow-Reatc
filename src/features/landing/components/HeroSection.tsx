// src/features/landing/components/HeroSection.tsx
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';

export const HeroSection: React.FC = () => {
  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 80px)', md: '70vh' },
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(32, 99, 160, 0.05) 0%, rgba(0, 188, 212, 0.03) 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(32, 99, 160, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 188, 212, 0.08) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          spacing={4}
          alignItems="center"
          textAlign="center"
          sx={{ py: { xs: 6, md: 8 } }}
        >
          {/* Logo Principal */}
          <Box
            component="img"
            src="/assets/images/logo.jpeg"
            alt="Rainbow Painting LLC"
            sx={{
              width: { xs: 200, sm: 250, md: 300 },
              height: { xs: 200, sm: 250, md: 300 },
              borderRadius: '50%',
              objectFit: 'cover',
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))',
              animation: 'float 6s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': {
                  transform: 'translateY(0px)',
                },
                '50%': {
                  transform: 'translateY(-15px)',
                }
              }
            }}
          />

          {/* Headline */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              maxWidth: 800
            }}
          >
            Professional Painting Services
          </Typography>

          {/* Subheadline */}
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              maxWidth: 700,
              fontWeight: 400
            }}
          >
            Transforming spaces with quality, precision, and years of experience
          </Typography>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ pt: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<EmailIcon />}
              onClick={handleContactClick}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 6
                },
                transition: 'all 0.3s'
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PhoneIcon />}
              href="tel:+18645258444"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s'
              }}
            >
              Call Now
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
