// src/features/landing/components/Footer.tsx
import { Box, Container, Typography, Stack, Divider, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.dark',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Main Footer Content */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            justifyContent="space-between"
          >
            {/* Company Info */}
            <Box sx={{ maxWidth: 400 }}>
              <Box
                component="img"
                src="/assets/images/logo.jpeg"
                alt="Rainbow Painting LLC"
                sx={{
                  height: 80,
                  mb: 2,
                  filter: 'brightness(1.2)'
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                Professional painting services for residential and commercial properties.
                Quality workmanship and customer satisfaction guaranteed.
              </Typography>
            </Box>

            {/* Quick Links */}
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => scrollToSection('about')}
                  sx={{
                    color: 'white',
                    opacity: 0.9,
                    textAlign: 'left',
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 1,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  About Us
                </Link>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => scrollToSection('services')}
                  sx={{
                    color: 'white',
                    opacity: 0.9,
                    textAlign: 'left',
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 1,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Our Services
                </Link>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => scrollToSection('projects')}
                  sx={{
                    color: 'white',
                    opacity: 0.9,
                    textAlign: 'left',
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 1,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Our Work
                </Link>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => scrollToSection('contact')}
                  sx={{
                    color: 'white',
                    opacity: 0.9,
                    textAlign: 'left',
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 1,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Contact
                </Link>
              </Stack>
            </Stack>

            {/* Contact Info */}
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                Contact
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  📍 315 Bagwell DR
                  <br />
                  Pauline, SC 29374
                </Typography>
                <Link
                  href="tel:+18645258444"
                  sx={{
                    color: 'white',
                    opacity: 0.9,
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 1,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  📞 (864) 525-8444
                </Link>
                <Link
                  href="mailto:admin@raimbow-painting.com"
                  sx={{
                    color: 'white',
                    opacity: 0.9,
                    textDecoration: 'none',
                    '&:hover': {
                      opacity: 1,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  ✉️ admin@raimbow-painting.com
                </Link>
              </Stack>
            </Stack>

            {/* Employee Portal */}
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                For Employees
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/portal')}
                sx={{
                  color: 'white',
                  opacity: 0.9,
                  textAlign: 'left',
                  textDecoration: 'none',
                  '&:hover': {
                    opacity: 1,
                    textDecoration: 'underline'
                  }
                }}
              >
                Employee Portal Login
              </Link>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Bottom Bar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © {currentYear} Rainbow Painting LLC. All rights reserved.
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Licensed, Insured & Bonded
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
