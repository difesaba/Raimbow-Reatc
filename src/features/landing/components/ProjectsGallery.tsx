// src/features/landing/components/ProjectsGallery.tsx
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Dialog,
  IconButton,
  Stack
} from '@mui/material';
import { Close as CloseIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';

const projectImages = [
  { src: '/assets/images/projects/pORTADAREEL.jpg', alt: 'Residential Exterior Project' },
  { src: '/assets/images/projects/IMG_0097.jpg', alt: 'Interior Living Room' },
  { src: '/assets/images/projects/IMG_0116.jpg', alt: 'Interior Room Detail' },
  { src: '/assets/images/projects/IMG_0117.jpg', alt: 'Interior Space' },
  { src: '/assets/images/projects/IMG_9518.JPG', alt: 'Commercial Project' },
  { src: '/assets/images/projects/IMG_9528.JPG', alt: 'Interior Painting' },
  { src: '/assets/images/projects/IMG_9533.JPG', alt: 'Wall Treatment' },
  { src: '/assets/images/projects/IMG_9565.JPG', alt: 'Room Transformation' },
  { src: '/assets/images/projects/IMG_9622.JPG', alt: 'Finished Interior' },
  { src: '/assets/images/projects/IMG_9779.JPG', alt: 'Professional Finish' },
  { src: '/assets/images/projects/IMG_9795.JPG', alt: 'Quality Work' },
  { src: '/assets/images/projects/IMG_9800.JPG', alt: 'Residential Interior' },
  { src: '/assets/images/projects/IMG_9819.JPG', alt: 'Completed Project' }
];

export const ProjectsGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + projectImages.length) % projectImages.length);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % projectImages.length);
    }
  };

  return (
    <Box
      id="projects"
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
              Our Work
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
              See the quality and precision in our completed projects
            </Typography>
          </Box>

          {/* Gallery Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 2
            }}
          >
            {projectImages.map((image, index) => (
              <Card
                key={index}
                elevation={3}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 6,
                    '& img': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}
                onClick={() => handleImageClick(index)}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={image.src}
                  alt={image.alt}
                  sx={{
                    transition: 'transform 0.3s',
                    objectFit: 'cover'
                  }}
                />
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>

      {/* Image Lightbox Dialog */}
      <Dialog
        open={selectedImage !== null}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            boxShadow: 'none'
          }
        }}
      >
        {selectedImage !== null && (
          <Box sx={{ position: 'relative' }}>
            {/* Close Button */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Previous Button */}
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <ChevronLeft />
            </IconButton>

            {/* Next Button */}
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <ChevronRight />
            </IconButton>

            {/* Image */}
            <Box
              component="img"
              src={projectImages[selectedImage].src}
              alt={projectImages[selectedImage].alt}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />

            {/* Image Counter */}
            <Typography
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                px: 2,
                py: 1,
                borderRadius: 1
              }}
            >
              {selectedImage + 1} / {projectImages.length}
            </Typography>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};
