// src/features/landing/components/ServiceAreasSection.tsx
import { Box, Container, Typography, Stack, Chip } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

const primaryAreas = [
  'Pauline, SC',
  'Spartanburg, SC',
  'Greenville, SC',
  'Greer, SC'
];

const secondaryAreas = [
  'Duncan, SC',
  'Wellford, SC',
  'Boiling Springs, SC',
  'Roebuck, SC',
  'Inman, SC',
  'Lyman, SC',
  'Startex, SC',
  'Una, SC',
  'Reidville, SC',
  'Moore, SC'
];

export const ServiceAreasSection: React.FC = () => {
  return (
    <Box
      id="service-areas"
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
              Proudly Serving Spartanburg County & Upstate South Carolina
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
              Rainbow Painting LLC provides professional painting services throughout the greater Spartanburg and Greenville areas
            </Typography>
          </Box>

          {/* Primary Service Area */}
          <Box>
            <Typography
              variant="h5"
              textAlign="center"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'primary.dark',
                mb: 3
              }}
            >
              Primary Service Area
            </Typography>
            <Stack
              direction="row"
              flexWrap="wrap"
              justifyContent="center"
              gap={2}
            >
              {primaryAreas.map((area, index) => (
                <Chip
                  key={index}
                  icon={<LocationIcon />}
                  label={area}
                  size="medium"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    py: 3,
                    px: 1,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.3s',
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Secondary Service Area */}
          <Box>
            <Typography
              variant="h5"
              textAlign="center"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'primary.dark',
                mb: 3
              }}
            >
              We Also Serve
            </Typography>
            <Stack
              direction="row"
              flexWrap="wrap"
              justifyContent="center"
              gap={2}
            >
              {secondaryAreas.map((area, index) => (
                <Chip
                  key={index}
                  label={area}
                  size="medium"
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    backgroundColor: 'white',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Coverage Note */}
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              p: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Don't See Your City Listed?
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Contact us - we may be able to accommodate your project depending on location and scope.
              We're always happy to discuss projects throughout Upstate South Carolina!
            </Typography>
          </Box>

          {/* Location */}
          <Box textAlign="center">
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>Our Office:</strong> 315 Bagwell Dr, Pauline, SC 29374
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Serving all of Spartanburg County and surrounding areas
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
