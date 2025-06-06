import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockProcessAnimation } from '../services/AIServiceManager';

// Create the context
const AnimationContext = createContext();

// Custom hook to use the animation context
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

// Provider component
export const AnimationProvider = ({ children }) => {
  // Source image state
  const [sourceImage, setSourceImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Animation configuration state
  const [animationConfig, setAnimationConfig] = useState(null);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [animationStatus, setAnimationStatus] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Result state
  const [animatedVideo, setAnimatedVideo] = useState(null);
  
  // Service information
  const [compatibleServices, setCompatibleServices] = useState([
    {
      id: 'stable-video-diffusion',
      name: 'Stable Video Diffusion',
      status: 'AVAILABLE',
      tier: 'FREE'
    },
    {
      id: 'pika-labs',
      name: 'Pika Labs',
      status: 'RATE_LIMITED',
      tier: 'FREE'
    },
    {
      id: 'colab-svd',
      name: 'Google Colab SVD',
      status: 'AVAILABLE',
      tier: 'FREE'
    }
  ]);
  
  // Reset animation status when source image changes
  useEffect(() => {
    if (sourceImage) {
      setAnimationStatus(null);
      setAnimatedVideo(null);
      setProcessingProgress(0);
    }
  }, [sourceImage]);
  
  // Function to start animation processing
  const startProcessing = async () => {
    if (!sourceImage || !animationConfig || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setAnimationStatus('PENDING');
      setAnimatedVideo(null);
      
      // Simulate preprocessing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnimationStatus('PREPROCESSING');
      
      // Simulate queue delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnimationStatus('IN_QUEUE');
      
      // Simulate animation processing with progress updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnimationStatus('PROCESSING');
      
      // Call our mock animation service (in a real app, this would be a real API call)
      const result = await mockProcessAnimation(sourceImage, animationConfig, (progress) => {
        setProcessingProgress(progress);
      });
      
      setAnimatedVideo(result);
      setAnimationStatus('COMPLETED');
    } catch (error) {
      console.error('Animation processing failed:', error);
      setAnimationStatus('FAILED');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to cancel processing
  const cancelProcessing = async () => {
    // In a real app, this would send a cancel request to the server
    setIsProcessing(false);
    setAnimationStatus('CANCELED');
    setProcessingProgress(0);
  };
  
  // Function to download the video
  const downloadVideo = async () => {
    if (!animatedVideo?.url) return;
    
    // In a real app, this would generate a signed URL or prepare the download
    // For this demo, we'll just open the video URL in a new tab
    window.open(animatedVideo.url, '_blank');
  };
  
  // Function to reset everything
  const resetAll = () => {
    setSourceImage(null);
    setAnimationConfig(null);
    setAnimatedVideo(null);
    setAnimationStatus(null);
    setProcessingProgress(0);
    setIsProcessing(false);
  };
  
  // Context value
  const value = {
    sourceImage,
    setSourceImage,
    isUploading,
    setIsUploading,
    animationConfig,
    setAnimationConfig,
    isProcessing,
    setIsProcessing,
    animationStatus,
    setAnimationStatus,
    processingProgress,
    setProcessingProgress,
    animatedVideo,
    setAnimatedVideo,
    compatibleServices,
    setCompatibleServices,
    startProcessing,
    cancelProcessing,
    downloadVideo,
    resetAll
  };
  
  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};
