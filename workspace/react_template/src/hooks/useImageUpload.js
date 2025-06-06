/**
 * useImageUpload.js
 * Custom hook for handling image uploads
 */

import { useState, useCallback } from 'react';
import { uploadImage as uploadImageToStorage } from '../services/FileStorageManager';

/**
 * Hook for handling image upload functionality
 */
const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  /**
   * Upload an image file
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} - Source image object
   */
  const uploadImage = useCallback(async (file) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 150);
      
      // Upload the image
      const result = await uploadImageToStorage(file);
      
      // Store the original file for API upload
      result.file = file;
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return result;
    } catch (error) {
      setUploadError(error.message || 'Failed to upload image');
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);
  
  /**
   * Validate an image file before upload
   * @param {File} file - The image file to validate
   * @returns {boolean} - Whether the file is valid
   */
  const validateImage = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10 MB
    
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return false;
    }
    
    if (file.size > maxSize) {
      setUploadError('File is too large. Please upload an image smaller than 10 MB.');
      return false;
    }
    
    return true;
  }, []);
  
  /**
   * Clear upload state
   */
  const resetUpload = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  }, []);

  return {
    uploadImage,
    validateImage,
    resetUpload,
    isUploading,
    uploadProgress,
    uploadError
  };
};

export default useImageUpload;