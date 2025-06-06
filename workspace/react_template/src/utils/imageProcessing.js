/**
 * imageProcessing.js
 * Utility functions for image processing
 */

/**
 * Resize an image to specified dimensions
 * @param {HTMLImageElement|string} image - Image or image URL to resize
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<Blob>} - Resized image as blob
 */
export const resizeImage = async (image, maxWidth = 1024, maxHeight = 1024) => {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Load image if URL was provided
      const imgElement = typeof image === 'string' ? new Image() : image;
      
      const processImage = () => {
        // Calculate new dimensions while preserving aspect ratio
        let width = imgElement.width;
        let height = imgElement.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        // Set canvas dimensions and draw resized image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(imgElement, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(blob => {
          resolve(blob);
        }, 'image/jpeg', 0.92); // Use JPEG with 92% quality
      };
      
      // If image is a URL, load it first
      if (typeof image === 'string') {
        imgElement.onload = processImage;
        imgElement.onerror = () => reject(new Error('Failed to load image for resizing'));
        imgElement.src = image;
      } else {
        processImage();
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Convert an image to base64 data URL
 * @param {Blob|File} imageFile - Image file or blob
 * @returns {Promise<string>} - Base64 data URL
 */
export const imageToBase64 = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
};

/**
 * Gets image dimensions from a file or URL
 * @param {File|Blob|string} image - Image file, blob, or URL
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export const getImageDimensions = async (image) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for dimension calculation'));
    };
    
    if (typeof image === 'string') {
      // If image is already a URL
      img.src = image;
    } else {
      // If image is a file or blob, create object URL
      img.src = URL.createObjectURL(image);
    }
  });
};

/**
 * Create a thumbnail version of an image
 * @param {HTMLImageElement|string} image - Image or image URL
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {Promise<string>} - Data URL of thumbnail
 */
export const createThumbnail = async (image, width = 200, height = 200) => {
  const blob = await resizeImage(image, width, height);
  return imageToBase64(blob);
};

export default {
  resizeImage,
  imageToBase64,
  getImageDimensions,
  createThumbnail
};