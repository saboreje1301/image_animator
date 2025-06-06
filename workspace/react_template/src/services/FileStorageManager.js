/**
 * FileStorageManager.js
 * Handles file uploads, downloads, and temporary storage
 */

/**
 * Uploads an image file and returns a source image object
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - The source image object
 */
export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a FileReader to read the file data
      const reader = new FileReader();

      reader.onload = (e) => {
        // Create an image element to get dimensions
        const img = new Image();
        
        img.onload = () => {
          // Create source image object with file metadata
          const sourceImage = {
            id: 'img-' + Date.now(),
            url: e.target.result, // Data URL for preview
            fileName: file.name,
            fileType: file.type,
            width: img.width,
            height: img.height,
            fileSize: file.size,
            uploadedAt: new Date()
          };
          
          resolve(sourceImage);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image. The file may be corrupted or not an image.'));
        };
        
        // Set the source of the image to the FileReader result
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read image file.'));
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Downloads a file from a URL
 * @param {string} url - The URL of the file to download
 * @param {string} fileName - The name to give the downloaded file
 * @returns {Promise<void>}
 */
export const downloadFile = async (url, fileName) => {
  try {
    // For demo purposes, we're just opening the URL in a new tab
    // In a real implementation, we would use proper download functionality
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

/**
 * Generates a temporary URL for a file
 * @param {string} fileUrl - The original file URL
 * @param {number} expiresIn - How long the URL should be valid (in seconds)
 * @returns {Promise<string>} - The signed URL
 */
export const generateSignedUrl = async (fileUrl, expiresIn = 3600) => {
  // In a real implementation, this would call a backend API to generate a signed URL
  // For this demo, we just return the original URL
  return fileUrl;
};

export default {
  uploadImage,
  downloadFile,
  generateSignedUrl
};