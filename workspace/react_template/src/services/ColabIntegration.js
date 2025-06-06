/**
 * ColabIntegration.js
 * Service for integrating with the Colab T4 backend API
 */

// Get API URL from config (injected by Colab notebook)
const getApiUrl = () => {
  if (window.API_CONFIG && window.API_CONFIG.apiUrl) {
    return window.API_CONFIG.apiUrl;
  }
  // Fallback local URL for development
  return 'http://localhost:5000';
};

/**
 * Check if the API server is running
 * @returns {Promise<Object>} - API health status
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/api/health`);
    if (!response.ok) {
      throw new Error(`API server returned ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

/**
 * Process an image with the T4 GPU
 * @param {File} imageFile - The image file to process
 * @param {Object} config - Animation configuration
 * @returns {Promise<string>} - Job ID for tracking progress
 */
export const processImage = async (imageFile, config) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('motion_strength', config.motionIntensity || 0.5);
    formData.append('duration', config.duration || 3.0);
    formData.append('fps', 24);
    
    const response = await fetch(`${getApiUrl()}/api/process`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API processing failed: ${errorData.error || response.status}`);
    }
    
    const data = await response.json();
    return data.job_id;
  } catch (error) {
    console.error('Image processing failed:', error);
    throw error;
  }
};

/**
 * Check the status of a processing job
 * @param {string} jobId - The job ID to check
 * @returns {Promise<Object>} - Job status data
 */
export const checkJobStatus = async (jobId) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/jobs/${jobId}`);
    if (!response.ok) {
      throw new Error(`Failed to get job status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Job status check failed:', error);
    throw error;
  }
};

/**
 * Get the video URL for a completed job
 * @param {string} jobId - The completed job ID
 * @returns {string} - Video URL
 */
export const getVideoUrl = (jobId) => {
  return `${getApiUrl()}/api/jobs/${jobId}/video`;
};

/**
 * Cancel a processing job
 * @param {string} jobId - The job ID to cancel
 * @returns {Promise<Object>} - Result of the cancellation
 */
export const cancelJob = async (jobId) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/jobs/${jobId}/cancel`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to cancel job: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Job cancellation failed:', error);
    throw error;
  }
};

export default {
  checkApiHealth,
  processImage,
  checkJobStatus,
  getVideoUrl,
  cancelJob
};