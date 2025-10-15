// src/features/landing/pages/LandingPage.tsx
import { Box } from '@mui/material';
import { PublicNavbar } from '../components/PublicNavbar';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { ProjectsGallery } from '../components/ProjectsGallery';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';

/**
 * LandingPage - Página pública de Rainbow Painting LLC
 *
 * Landing page profesional para cumplir con requisitos de WhatsApp Business.
 * Muestra información corporativa accesible sin autenticación.
 *
 * Secciones:
 * - Navbar: Logo y acceso al portal de empleados
 * - Hero: Banner principal con logo y CTAs
 * - About: Información de la empresa
 * - Services: Servicios ofrecidos
 * - Projects: Galería de trabajos realizados
 * - Contact: Información de contacto
 * - Footer: Links y copyright
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
      <ProjectsGallery />
      <ContactSection />
      <Footer />
    </Box>
  );
};
