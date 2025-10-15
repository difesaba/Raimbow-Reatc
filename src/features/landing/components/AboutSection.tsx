// src/features/landing/components/AboutSection.tsx
import { Box, Container, Typography, Card, CardContent, Stack } from '@mui/material';
import {
  WorkspacePremium as QualityIcon,
  Groups as TeamIcon,
  Schedule as ExperienceIcon,
  VerifiedUser as TrustIcon
} from '@mui/icons-material';

const features = [
  {
    icon: QualityIcon,
    title: 'Premium Quality',
    description: 'We use only the highest quality paints and materials for lasting results'
  },
  {
    icon: ExperienceIcon,
    title: 'Years of Experience',
    description: 'Decades of expertise in both residential and commercial painting projects'
  },
  {
    icon: TeamIcon,
    title: 'Professional Team',
    description: 'Skilled craftsmen dedicated to delivering excellence on every project'
  },
  {
    icon: TrustIcon,
    title: 'Trusted Service',
    description: 'Licensed, insured, and committed to customer satisfaction'
  }
];

export const AboutSection: React.FC = () => {
  return (
    <Box
      id="about"
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
              About Rainbow Painting LLC
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
              Your Trusted Partner in Professional Painting Services
            </Typography>
          </Box>

          {/* Main Content */}
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <Typography
              variant="body1"
              paragraph
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.primary',
                textAlign: 'center'
              }}
            >
              Rainbow Painting LLC is a professional painting company dedicated to transforming
              residential and commercial spaces with precision, quality, and care. With years of
              experience in the industry, our team of skilled professionals brings expertise and
              attention to detail to every project we undertake.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.primary',
                textAlign: 'center'
              }}
            >
              We pride ourselves on using premium materials, maintaining the highest standards of
              craftsmanship, and delivering results that exceed our clients' expectations. Whether
              it's a home renovation or a large commercial project, Rainbow Painting is committed
              to bringing your vision to life.
            </Typography>
          </Box>

          {/* Feature Cards */}
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
            {features.map((feature, index) => (
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
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <feature.icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
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
