// src/features/landing/components/ServicesSection.tsx
import { Box, Container, Typography, Card, CardContent, Stack, List, ListItem, ListItemText } from '@mui/material';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  Brush as InteriorIcon,
  Landscape as ExteriorIcon,
  Kitchen as CabinetIcon,
  Deck as DeckIcon
} from '@mui/icons-material';

const services = [
  {
    icon: InteriorIcon,
    title: 'Residential Interior Painting',
    description: 'Transform your home\'s interior with premium paints and expert craftsmanship. We handle bedrooms, living rooms, kitchens, bathrooms, and entire homes in Spartanburg County.',
    features: [
      'Professional surface preparation',
      'Low-VOC, family-safe paints',
      'Clean, neat workmanship',
      'Color consultation available'
    ]
  },
  {
    icon: ExteriorIcon,
    title: 'Residential Exterior Painting',
    description: 'Protect and beautify your home\'s exterior with weather-resistant coatings. Perfect for South Carolina\'s humid climate and temperature variations.',
    features: [
      'Pressure washing included',
      'Weather-resistant paints',
      'Siding, trim, and fascia',
      '10+ year durability'
    ]
  },
  {
    icon: BusinessIcon,
    title: 'Commercial Painting',
    description: 'Professional painting for offices, retail stores, restaurants, and commercial buildings throughout Spartanburg and Greenville.',
    features: [
      'Flexible scheduling (nights/weekends)',
      'Fast turnaround times',
      'Commercial-grade materials',
      'Minimal business disruption'
    ]
  },
  {
    icon: HomeIcon,
    title: 'Industrial & Warehouses',
    description: 'Durable coatings for warehouses, manufacturing facilities, and industrial buildings throughout Upstate SC.',
    features: [
      'High-traffic area coatings',
      'Safety line marking',
      'Epoxy floor coatings',
      'Large-scale projects'
    ]
  },
  {
    icon: CabinetIcon,
    title: 'Cabinet Refinishing',
    description: 'Refresh your kitchen or bathroom cabinets with professional painting and refinishing services.',
    features: [
      'Kitchen cabinet painting',
      'Bathroom vanity refinishing',
      'Modern finishes',
      'Cost-effective upgrade'
    ]
  },
  {
    icon: DeckIcon,
    title: 'Specialty Services',
    description: 'Additional painting services to complete your project needs.',
    features: [
      'Deck staining & sealing',
      'Fence painting',
      'Popcorn ceiling removal',
      'Drywall repair'
    ]
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
              Comprehensive Painting Services in Spartanburg County
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: 800,
                mx: 'auto',
                mt: 2
              }}
            >
              Whether you need residential or commercial painting, Rainbow Painting LLC delivers exceptional results for every project
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
                    <List dense sx={{ pl: 0 }}>
                      {service.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5, pl: 0 }}>
                          <ListItemText
                            primary={`✓ ${feature}`}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'text.secondary',
                              sx: { fontSize: '0.9rem' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
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
