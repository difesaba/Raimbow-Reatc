// src/features/landing/components/ContactSection.tsx
import { Box, Container, Typography, Card, CardContent, Stack, Link } from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as HoursIcon
} from '@mui/icons-material';

const contactInfo = [
  {
    icon: PhoneIcon,
    title: 'Phone',
    value: '(864) 525-8444',
    link: 'tel:+18645258444',
    description: 'Call us for a free quote'
  },
  {
    icon: EmailIcon,
    title: 'Email',
    value: 'admin@raimbow-painting.com',
    link: 'mailto:admin@raimbow-painting.com',
    description: 'Send us a message anytime'
  },
  {
    icon: LocationIcon,
    title: 'Address',
    value: '315 Bagwell DR, Pauline, SC 29374',
    link: null,
    description: 'South Carolina'
  },
  {
    icon: HoursIcon,
    title: 'Business Hours',
    value: 'Mon-Fri: 8AM - 6PM',
    link: null,
    description: 'Sat: 9AM - 4PM'
  }
];

export const ContactSection: React.FC = () => {
  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: 'grey.50'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* Section Header */}
          <Box textAlign="center">
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: 700,
                mx: 'auto',
                mt: 2
              }}
            >
              Get in touch for a free consultation and quote
            </Typography>
          </Box>

          {/* Contact Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 3
            }}
          >
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <info.icon sx={{ fontSize: 28 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} color="primary.dark">
                      {info.title}
                    </Typography>
                    {info.link ? (
                      <Link
                        href={info.link}
                        underline="hover"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                      >
                        {info.value}
                      </Link>
                    ) : (
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {info.value}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {info.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Additional Info */}
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              p: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Ready to Transform Your Space?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Contact Rainbow Painting LLC today for a free estimate on your next project
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Link
                href="tel:+18645258444"
                sx={{ textDecoration: 'none' }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  📞 (864) 525-8444
                </Typography>
              </Link>
              <Typography variant="h6" sx={{ color: 'white', opacity: 0.7 }}>
                |
              </Typography>
              <Link
                href="mailto:admin@raimbow-painting.com"
                sx={{ textDecoration: 'none' }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  ✉️ admin@raimbow-painting.com
                </Typography>
              </Link>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
