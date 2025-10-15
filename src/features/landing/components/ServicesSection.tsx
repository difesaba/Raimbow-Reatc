// src/features/landing/components/ServicesSection.tsx
import { Box, Container, Typography, Card, CardContent, Stack } from '@mui/material';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  Brush as InteriorIcon,
  Landscape as ExteriorIcon,
  ColorLens as CustomIcon,
  Apartment as CommercialIcon
} from '@mui/icons-material';

const services = [
  {
    icon: HomeIcon,
    title: 'Residential Painting',
    description: 'Complete interior and exterior painting services for homes, apartments, and condominiums'
  },
  {
    icon: BusinessIcon,
    title: 'Commercial Painting',
    description: 'Professional painting solutions for offices, retail spaces, and commercial buildings'
  },
  {
    icon: InteriorIcon,
    title: 'Interior Painting',
    description: 'Transform your indoor spaces with expert color consultation and precise application'
  },
  {
    icon: ExteriorIcon,
    title: 'Exterior Painting',
    description: 'Weather-resistant coatings and professional finishes for lasting curb appeal'
  },
  {
    icon: CustomIcon,
    title: 'Custom Finishes',
    description: 'Specialty textures, decorative painting, and custom color matching services'
  },
  {
    icon: CommercialIcon,
    title: 'New Construction',
    description: 'Complete painting services for new builds and development projects'
  }
];

export const ServicesSection: React.FC = () => {
  return (
    <Box
      id="services"
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
              Our Services
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
              Comprehensive painting solutions tailored to your needs
            </Typography>
          </Box>

          {/* Service Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 3
            }}
          >
            {services.map((service, index) => (
              <Card
                key={index}
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                    '& .service-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                      backgroundColor: 'secondary.main'
                    }
                  }
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box
                      className="service-icon"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        transition: 'all 0.3s'
                      }}
                    >
                      <service.icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} color="primary.dark">
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {service.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Call to Action */}
          <Box textAlign="center" sx={{ pt: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Don't see what you're looking for?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Contact us to discuss your specific painting project needs
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
