// src/features/landing/pages/LandingPage.tsx
import { Box } from '@mui/material';
import { PublicNavbar } from '../components/PublicNavbar';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { WhyChooseUsSection } from '../components/WhyChooseUsSection';
import { ProjectsGallery } from '../components/ProjectsGallery';
import { ServiceAreasSection } from '../components/ServiceAreasSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';

/**
 * LandingPage - Public page for Rainbow Painting LLC
 *
 * Professional landing page optimized for SEO and conversions.
 * Displays company information accessible without authentication.
 *
 * Sections:
 * - Navbar: Logo and employee portal access
 * - Hero: Main banner with logo, local keywords, and CTAs
 * - About: Company information with local Spartanburg County focus
 * - Services: Comprehensive residential & commercial services
 * - Why Choose Us: Trust signals and differentiators
 * - Projects: Gallery of completed work
 * - Service Areas: Cities and areas served in Upstate SC
 * - Contact: Contact information and quote request
 * - Footer: Links and copyright
 */
export const LandingPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default'
      }}
    >
      <PublicNavbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <ProjectsGallery />
      <ServiceAreasSection />
      <ContactSection />
      <Footer />
    </Box>
  );
};
