/**
 * useAnimationConfig.js
 * Custom hook for managing animation configuration
 */

import { useState, useEffect } from 'react';
import { getAnimationStyles, getCompatibleServices } from '../services/AIServiceManager';

/**
 * Hook for managing animation configuration and compatible services
 */
const useAnimationConfig = () => {
  const [availableStyles, setAvailableStyles] = useState([]);
  const [qualityOptions, setQualityOptions] = useState([]);

  // Initialize available styles and quality options
  useEffect(() => {
    // Get animation styles from service
    const styles = getAnimationStyles();
    
    // For each style, create a placeholder thumbnail URL if needed
    const stylesWithThumbnails = styles.map(style => {
      // In a real app, these would be actual thumbnails
      // For this demo, we're using placeholder images
      const thumbnail = style.thumbnail || `https://via.placeholder.com/200x150/6366F1/FFFFFF?text=${encodeURIComponent(style.name)}`;
      
      return {
        ...style,
        thumbnail
      };
    });
    
    setAvailableStyles(stylesWithThumbnails);
    
    // Set quality options
    setQualityOptions([
      {
        id: 'LOW',
        name: 'Low',
        description: 'Fast processing, smaller file size',
        restricted: false
      },
      {
        id: 'MEDIUM',
        name: 'Medium',
        description: 'Balanced quality and speed',
        restricted: false
      },
      {
        id: 'HIGH',
        name: 'High',
        description: 'Best quality, longer processing time',
        restricted: false // This would be true in a production app for premium tier
      }
    ]);
  }, []);

  /**
   * Gets compatible services based on animation config
   * @param {Object} config - The current animation configuration
   * @returns {Array} - List of compatible services
   */
  const getCompatible = (config) => {
    if (!config) return [];
    return getCompatibleServices(config);
  };
  
  return {
    availableStyles,
    qualityOptions,
    getCompatibleServices: getCompatible
  };
};

export default useAnimationConfig;