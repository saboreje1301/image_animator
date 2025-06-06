import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { mockProcessAnimation } from '../services/AIServiceManager';
import { processImage, checkJobStatus, getVideoUrl } from '../services/ColabIntegration';

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
  const [currentJobId, setCurrentJobId] = useState(null);
  
  // Result state
  const [animatedVideo, setAnimatedVideo] = useState(null);
  
  // Polling ref and intervals
  const pollingIntervalRef = useRef(null);
  const statusCheckIntervalMs = 2000; // Check status every 2 seconds
  
  // Service information
  const [compatibleServices, setCompatibleServices] = useState([
    {
      id: 'stable-video-diffusion',
      name: 'Stable Video Diffusion',
      status: 'AVAILABLE',
      tier: 'FREE'
    },
    {
      id: 'colab-t4',
      name: 'Google Colab T4',
      status: 'AVAILABLE',
      tier: 'FREE'
    },
    {
      id: 'pika-labs',
      name: 'Pika Labs',
      status: 'RATE_LIMITED',
      tier: 'FREE'
    }
  ]);
  
  // Reset animation status when source image changes
  useEffect(() => {
    if (sourceImage) {
      setAnimationStatus(null);
      setAnimatedVideo(null);
      setProcessingProgress(0);
      setCurrentJobId(null);
    }
  }, [sourceImage]);
  
  // Cleanup polling interval when unmounting
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);
  
  // Function to poll job status
  const pollJobStatus = async (jobId) => {
    try {
      const status = await checkJobStatus(jobId);
      
      // Update progress
      setProcessingProgress(status.progress / 100 || 0);
      
      // Update status
      if (status.status === 'COMPLETED') {
        clearInterval(pollingIntervalRef.current);
        setAnimationStatus('COMPLETED');
        setIsProcessing(false);
        
        // Create video object with URL from the API
        const videoUrl = getVideoUrl(jobId);
        setAnimatedVideo({
          id: jobId,
          url: videoUrl,
          format: 'mp4',
          duration: animationConfig.duration,
          width: sourceImage.width,
          height: sourceImage.height,
          quality: animationConfig.quality
        });
      } else if (status.status === 'FAILED') {
        clearInterval(pollingIntervalRef.current);
        setAnimationStatus('FAILED');
        setIsProcessing(false);
        console.error('Job failed:', status.error);
      } else if (status.status === 'PROCESSING') {
        setAnimationStatus('PROCESSING');
      }
    } catch (error) {
      console.error('Failed to check job status:', error);
    }
  };
  
  // Function to start animation processing
  const startProcessing = async () => {
    if (!sourceImage || !animationConfig || isProcessing) return;
    
    // Use Colab backend if available, otherwise fall back to mock
    const useColab = window.API_CONFIG && window.API_CONFIG.apiUrl;
    
    try {
      setIsProcessing(true);
      setAnimationStatus('PENDING');
      setAnimatedVideo(null);
      
      if (useColab) {
        // Process with Colab T4 backend
        setAnimationStatus('PREPROCESSING');
        
        try {
          // Upload and process the image
          const jobId = await processImage(sourceImage.file, animationConfig);
          setCurrentJobId(jobId);
          setAnimationStatus('IN_QUEUE');
          
          // Set up polling for status updates
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          
          pollingIntervalRef.current = setInterval(() => {
            pollJobStatus(jobId);
          }, statusCheckIntervalMs);
          
        } catch (error) {
          console.error('Failed to process with Colab backend:', error);
          throw error;
        }
      } else {
        // Fallback to mock implementation
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAnimationStatus('PREPROCESSING');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAnimationStatus('IN_QUEUE');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnimationStatus('PROCESSING');
        
        // Call mock animation service
        const result = await mockProcessAnimation(sourceImage, animationConfig, (progress) => {
          setProcessingProgress(progress);
        });
        
        setAnimatedVideo(result);
        setAnimationStatus('COMPLETED');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Animation processing failed:', error);
      setAnimationStatus('FAILED');
      setIsProcessing(false);
    }
  };
  
  // Function to cancel processing
  const cancelProcessing = async () => {
    // If we have a job ID, try to cancel it with the API
    if (currentJobId) {
      try {
        // In a real app with complete API, this would cancel the job
        // For simplicity in this demo, we'll just stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        // await cancelJob(currentJobId); - This would be the API call in a complete implementation
      } catch (error) {
        console.error('Failed to cancel job:', error);
      }
    }
    
    setIsProcessing(false);
    setAnimationStatus('CANCELED');
    setProcessingProgress(0);
    setCurrentJobId(null);
  };
  
  // Function to download the video
  const downloadVideo = async () => {
    if (!animatedVideo?.url) return;
    
    // For Colab-generated videos or other videos, open in new tab
    window.open(animatedVideo.url, '_blank');
    
    // In a production app, we'd implement proper download with progress tracking
    // const downloadUrl = await generateSignedUrl(animatedVideo.url);
    // downloadFile(downloadUrl, `animated-video-${animatedVideo.id}.mp4`);
  };
  
  // Function to reset everything
  const resetAll = () => {
    // Clear polling if active
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    setSourceImage(null);
    setAnimationConfig(null);
    setAnimatedVideo(null);
    setAnimationStatus(null);
    setProcessingProgress(0);
    setIsProcessing(false);
    setCurrentJobId(null);
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