/**
 * AIServiceManager.js
 * Manages interactions with AI services for image-to-video animation
 */

// Example animation service statuses
const SERVICE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RATE_LIMITED: 'RATE_LIMITED',
  UNAVAILABLE: 'UNAVAILABLE',
  MAINTENANCE: 'MAINTENANCE'
};

// Sample animation styles with placeholder thumbnails
const animationStyles = [
  {
    id: 'natural',
    name: 'Natural Motion',
    description: 'Subtle, realistic movement that maintains the original style',
    thumbnail: '/assets/styles/natural.jpg'
  },
  {
    id: 'zoom',
    name: 'Zoom In',
    description: 'Gradually zooms into the focal point of the image',
    thumbnail: '/assets/styles/zoom.jpg'
  },
  {
    id: 'parallax',
    name: 'Parallax',
    description: 'Creates depth by animating layers at different speeds',
    thumbnail: '/assets/styles/parallax.jpg'
  },
  {
    id: 'bounce',
    name: 'Bounce',
    description: 'Adds a playful bouncing effect to image elements',
    thumbnail: '/assets/styles/bounce.jpg'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Dramatic camera movements and lighting effects',
    thumbnail: '/assets/styles/cinematic.jpg'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative, stylized motion with artistic flair',
    thumbnail: '/assets/styles/artistic.jpg'
  },
];

/**
 * Mock function to simulate processing an animation through an AI service
 * @param {Object} sourceImage - The source image object
 * @param {Object} config - Animation configuration
 * @param {Function} progressCallback - Callback for progress updates
 * @returns {Promise<Object>} - The animated video result
 */
export const mockProcessAnimation = async (sourceImage, config, progressCallback) => {
  // Simulate processing time based on quality and duration
  const processingTime = 
    config.quality === 'HIGH' ? 10000 : 
    config.quality === 'MEDIUM' ? 7000 : 5000;
  
  // Simulate progress updates
  let progress = 0;
  const interval = setInterval(() => {
    progress += 0.05;
    if (progress >= 1) {
      clearInterval(interval);
      progress = 1;
    }
    progressCallback(progress);
  }, processingTime / 20);
  
  // Wait for processing to complete
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  // Clear interval if it's still running
  clearInterval(interval);
  
  // Return mock result
  return {
    id: 'video-' + Date.now(),
    animationId: 'anim-' + Date.now(),
    url: getMockVideoUrl(config.styleType),
    format: 'mp4',
    duration: config.duration,
    width: sourceImage.width,
    height: sourceImage.height,
    fileSize: Math.round(sourceImage.fileSize * 2.5),
    quality: config.quality
  };
};

/**
 * Get a sample video URL based on animation style
 * @param {string} styleType - The animation style
 * @returns {string} - URL to a sample video
 */
const getMockVideoUrl = (styleType) => {
  // For a real application, these would be actual generated videos
  // For this demo, we're using sample videos
  const sampleVideos = {
    'natural': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'zoom': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'parallax': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'bounce': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'cinematic': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'artistic': 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  };

  return sampleVideos[styleType] || sampleVideos.natural;
};

/**
 * Gets available animation styles
 * @returns {Array} - List of available styles with metadata
 */
export const getAnimationStyles = () => {
  return animationStyles;
};

/**
 * Checks which AI services are compatible with the given configuration
 * @param {Object} config - Animation configuration
 * @returns {Array} - List of compatible services
 */
export const getCompatibleServices = (config) => {
  // In a real implementation, this would check actual service capabilities
  // For this demo, we're returning mock data
  const mockServices = [
    {
      id: 'stable-video-diffusion',
      name: 'Stable Video Diffusion',
      status: SERVICE_STATUS.AVAILABLE,
      tier: 'FREE',
      supportedStyles: ['natural', 'zoom', 'parallax']
    },
    {
      id: 'pika-labs',
      name: 'Pika Labs',
      status: config.quality === 'HIGH' ? SERVICE_STATUS.RATE_LIMITED : SERVICE_STATUS.AVAILABLE,
      tier: 'FREE',
      supportedStyles: ['natural', 'zoom', 'cinematic', 'artistic']
    },
    {
      id: 'colab-adapter',
      name: 'Google Colab SVD',
      status: SERVICE_STATUS.AVAILABLE,
      tier: 'FREE',
      supportedStyles: ['natural', 'zoom', 'parallax', 'bounce']
    }
  ];
  
  // Filter to only include services that support the selected style
  return mockServices.filter(service => service.supportedStyles.includes(config.styleType));
};

export default {
  mockProcessAnimation,
  getAnimationStyles,
  getCompatibleServices,
  SERVICE_STATUS
};