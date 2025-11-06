// src/features/landing/components/WhyChooseUsSection.tsx
import { Box, Container, Typography, Card, CardContent, Stack } from '@mui/material';
import {
  LocationOn as LocalIcon,
  VerifiedUser as LicenseIcon,
  AttachMoney as PriceIcon,
  Brush as QualityIcon,
  Schedule as TimeIcon,
  CleaningServices as CleanIcon,
  Handshake as SatisfactionIcon,
  HomeRepairService as VersatilityIcon
} from '@mui/icons-material';

const reasons = [
  {
    icon: LocalIcon,
    title: 'Local Experts',
    description: 'Based in Pauline, SC, we understand the unique needs of Spartanburg County properties - from weather challenges to local architecture styles.'
  },
  {
    icon: LicenseIcon,
    title: 'Licensed & Insured',
    description: 'Fully licensed South Carolina contractors with comprehensive liability insurance for your complete peace of mind.'
  },
  {
    icon: PriceIcon,
    title: 'Transparent Pricing',
    description: 'Detailed written estimates with no hidden costs. You\'ll know exactly what you\'re paying before we start.'
  },
  {
    icon: QualityIcon,
    title: 'Premium Materials',
    description: 'We use only top-quality paints from Sherwin-Williams and Benjamin Moore, designed to withstand South Carolina\'s climate.'
  },
  {
    icon: TimeIcon,
    title: 'On-Time, Every Time',
    description: 'We respect your schedule. Projects are completed within the agreed timeframe, guaranteed.'
  },
  {
    icon: SatisfactionIcon,
    title: 'Satisfaction Guaranteed',
    description: 'Not happy? We\'ll make it right at no extra cost. Your satisfaction is our top priority.'
  },
  {
    icon: VersatilityIcon,
    title: 'Residential & Commercial',
    description: 'From single-family homes to large commercial buildings - we handle projects of all sizes with equal expertise.'
  },
  {
    icon: CleanIcon,
    title: 'Spotless Job Sites',
    description: 'We protect your property, clean up daily, and leave your space cleaner than we found it.'
  }
];

export const WhyChooseUsSection: React.FC = () => {
  return (
    <Box
      id="why-choose-us"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: 'background.paper'
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
              Why Rainbow Painting LLC Stands Out in Upstate SC
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
              Experience the difference of working with Spartanburg County's trusted painting professionals
            </Typography>
          </Box>

          {/* Reasons Grid */}
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
            {reasons.map((reason, index) => (
              <Card
                key={index}
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                    '& .reason-icon': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'secondary.main'
                    }
                  }
                }}
              >
                <CardContent>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Box
                      className="reason-icon"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        transition: 'all 0.3s'
                      }}
                    >
                      <reason.icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} color="primary.dark">
                      {reason.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {reason.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
