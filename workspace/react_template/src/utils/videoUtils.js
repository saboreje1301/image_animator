/**
 * videoUtils.js
 * Utility functions for video processing and playback
 */

/**
 * Get the duration of a video from a URL
 * @param {string} videoUrl - URL of the video
 * @returns {Promise<number>} - Duration in seconds
 */
export const getVideoDuration = async (videoUrl) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      resolve(video.duration);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = videoUrl;
  });
};

/**
 * Generate a thumbnail from a video at a specific time
 * @param {string} videoUrl - URL of the video
 * @param {number} timeInSeconds - Time to capture thumbnail (defaults to 0)
 * @returns {Promise<string>} - Data URL of the thumbnail
 */
export const generateVideoThumbnail = async (videoUrl, timeInSeconds = 0) => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous'; // Handle CORS issues
      
      // Set up event handlers
      video.onloadedmetadata = () => {
        // Make sure we seek to a valid time
        const seekTime = Math.min(timeInSeconds, video.duration);
        video.currentTime = seekTime;
      };
      
      video.onseeked = () => {
        // Create canvas and draw video frame
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        resolve(dataUrl);
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video for thumbnail generation'));
      };
      
      // Start loading the video
      video.src = videoUrl;
      video.load();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Format video duration in MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate the file size of a video file
 * @param {number} duration - Duration in seconds
 * @param {string} quality - Video quality (LOW, MEDIUM, HIGH)
 * @param {number} width - Video width in pixels
 * @param {number} height - Video height in pixels
 * @returns {number} - Estimated file size in bytes
 */
export const estimateVideoFileSize = (duration, quality, width, height) => {
  // These are rough estimates
  const bitrates = {
    'LOW': 500000,      // 500 Kbps
    'MEDIUM': 2000000,  // 2 Mbps
    'HIGH': 5000000     // 5 Mbps
  };
  
  const bitrate = bitrates[quality] || bitrates.MEDIUM;
  return Math.round((bitrate * duration) / 8); // Convert bits to bytes
};

/**
 * Check if a browser supports a specific video format
 * @param {string} format - Video format (e.g., 'mp4', 'webm')
 * @returns {boolean} - Whether the format is supported
 */
export const isFormatSupported = (format) => {
  const video = document.createElement('video');
  
  switch (format.toLowerCase()) {
    case 'mp4':
      return video.canPlayType('video/mp4') !== '';
    case 'webm':
      return video.canPlayType('video/webm') !== '';
    case 'ogg':
      return video.canPlayType('video/ogg') !== '';
    default:
      return false;
  }
};

export default {
  getVideoDuration,
  generateVideoThumbnail,
  formatDuration,
  estimateVideoFileSize,
  isFormatSupported
};