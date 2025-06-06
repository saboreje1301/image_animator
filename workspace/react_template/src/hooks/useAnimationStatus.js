/**
 * useAnimationStatus.js
 * Custom hook for tracking animation processing status
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing animation processing status
 * @param {string} animationId - ID of the animation to track
 * @param {Object} notificationService - Service for receiving status updates
 * @returns {Object} - Animation status information and control functions
 */
const useAnimationStatus = (animationId, notificationService) => {
  // Status states
  const [status, setStatus] = useState('PENDING');
  const [progress, setProgress] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
  
  // Subscribe to status updates when animation ID changes
  useEffect(() => {
    if (!animationId || !notificationService) return;
    
    // Set initial state
    setStatus('PENDING');
    setProgress(0);
    setIsComplete(false);
    setError(null);
    
    // Subscribe to status updates
    const subscription = notificationService.subscribeToAnimationStatus(
      animationId,
      (update) => {
        setStatus(update.status);
        setProgress(update.progress || 0);
        setEstimatedTimeRemaining(update.estimatedTimeRemaining);
        setError(update.error || null);
        
        // Check if completed or failed
        if (update.status === 'COMPLETED') {
          setIsComplete(true);
        } else if (update.status === 'FAILED') {
          setError(update.error || 'Animation processing failed');
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      notificationService.unsubscribe(subscription);
    };
  }, [animationId, notificationService]);
  
  /**
   * Check if the animation is currently in a processing state
   */
  const isProcessing = ['PENDING', 'PREPROCESSING', 'IN_QUEUE', 'PROCESSING'].includes(status);
  
  /**
   * Format the estimated time remaining
   */
  const formatTimeRemaining = useCallback(() => {
    if (!estimatedTimeRemaining) return 'Calculating...';
    
    const minutes = Math.floor(estimatedTimeRemaining / 60);
    const seconds = Math.floor(estimatedTimeRemaining % 60);
    
    if (minutes > 0) {
      return `~${minutes}m ${seconds}s remaining`;
    }
    return `~${seconds}s remaining`;
  }, [estimatedTimeRemaining]);
  
  /**
   * Get a user-friendly status message
   */
  const getStatusMessage = useCallback(() => {
    switch (status) {
      case 'PENDING':
        return 'Preparing for processing...';
      case 'PREPROCESSING':
        return 'Preprocessing image...';
      case 'IN_QUEUE':
        return 'In processing queue...';
      case 'PROCESSING':
        return `Generating animation (${Math.round(progress * 100)}%)`;
      case 'COMPLETED':
        return 'Animation complete!';
      case 'FAILED':
        return `Failed: ${error || 'Unknown error'}`;
      case 'CANCELED':
        return 'Animation was canceled';
      default:
        return 'Unknown status';
    }
  }, [status, progress, error]);
  
  return {
    status,
    progress,
    isProcessing,
    isComplete,
    error,
    estimatedTimeRemaining,
    formatTimeRemaining,
    getStatusMessage
  };
};

export default useAnimationStatus;