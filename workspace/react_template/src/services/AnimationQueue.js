/**
 * AnimationQueue.js
 * Manages the queue of animations to be processed
 */

// Queue statuses
export const QUEUE_STATUS = {
  IDLE: 'IDLE',
  PROCESSING: 'PROCESSING',
  PAUSED: 'PAUSED',
  ERROR: 'ERROR'
};

class AnimationQueue {
  constructor() {
    this.queue = [];
    this.status = QUEUE_STATUS.IDLE;
    this.currentlyProcessing = null;
    this.onStatusChange = null;
    this.maxConcurrent = 1; // Number of animations to process concurrently
  }
  
  /**
   * Add an animation to the processing queue
   * @param {Object} animation - Animation object
   * @param {Object} options - Queue options
   * @returns {string} - Queue ID
   */
  addToQueue(animation, options = {}) {
    const queueId = `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const queueItem = {
      id: queueId,
      animation,
      priority: options.priority || 'normal',
      added: new Date(),
      status: 'PENDING',
      attempts: 0,
      maxAttempts: options.maxAttempts || 3
    };
    
    // Add to queue based on priority
    if (queueItem.priority === 'high') {
      this.queue.unshift(queueItem);
    } else {
      this.queue.push(queueItem);
    }
    
    this._notifyStatusChange();
    this._processQueue();
    
    return queueId;
  }
  
  /**
   * Get the position of an animation in the queue
   * @param {string} animationId - Animation ID
   * @returns {number} - Queue position (1-based) or -1 if not found
   */
  getQueuePosition(animationId) {
    const index = this.queue.findIndex(item => item.animation.id === animationId);
    return index === -1 ? -1 : index + 1;
  }
  
  /**
   * Process the next animation in the queue
   * @private
   */
  async _processQueue() {
    // If already processing max concurrent items or queue is paused, do nothing
    if (this.status === QUEUE_STATUS.PAUSED) {
      return;
    }
    
    // If queue is empty, set status to idle
    if (this.queue.length === 0) {
      this.status = QUEUE_STATUS.IDLE;
      this._notifyStatusChange();
      return;
    }
    
    // Set status to processing
    this.status = QUEUE_STATUS.PROCESSING;
    this._notifyStatusChange();
    
    // In this mock version, we're not actually processing anything
    // In a real implementation, this would dispatch to a worker or service
  }
  
  /**
   * Cancel processing of an animation
   * @param {string} animationId - Animation ID
   * @returns {boolean} - Whether cancellation was successful
   */
  cancelAnimation(animationId) {
    // Find the animation in the queue
    const index = this.queue.findIndex(item => item.animation.id === animationId);
    
    if (index !== -1) {
      // Remove from queue
      this.queue.splice(index, 1);
      this._notifyStatusChange();
      return true;
    }
    
    // If it's currently processing, we'd need to signal the processor to cancel
    // This is simplified for the demo
    return false;
  }
  
  /**
   * Get estimated time until an animation is processed
   * @param {string} animationId - Animation ID
   * @returns {number} - Estimated time in seconds, or -1 if not found
   */
  getEstimatedTime(animationId) {
    const position = this.getQueuePosition(animationId);
    
    if (position === -1) return -1;
    
    // Mock calculation - in real app would use historical processing data
    // Assume 30 seconds per queued item
    return position * 30;
  }
  
  /**
   * Set a callback to be notified of queue status changes
   * @param {Function} callback - Status change callback
   */
  setStatusChangeCallback(callback) {
    this.onStatusChange = callback;
  }
  
  /**
   * Notify listeners of status change
   * @private
   */
  _notifyStatusChange() {
    if (this.onStatusChange) {
      this.onStatusChange({
        status: this.status,
        queueLength: this.queue.length,
        currentlyProcessing: this.currentlyProcessing
      });
    }
  }
  
  /**
   * Get current queue status
   * @returns {Object} - Queue status information
   */
  getStatus() {
    return {
      status: this.status,
      queueLength: this.queue.length,
      currentlyProcessing: this.currentlyProcessing
    };
  }
}

// Create a singleton instance
const animationQueue = new AnimationQueue();

export default animationQueue;