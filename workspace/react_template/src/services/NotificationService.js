/**
 * NotificationService.js
 * Handles real-time notifications and status updates
 */

// Notification types
export const NOTIFICATION_TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

class NotificationService {
  constructor() {
    this.subscribers = new Map();
    this.nextSubscriptionId = 1;
    this.notificationHistory = [];
    this.maxHistorySize = 50;
  }
  
  /**
   * Send a notification to a specific user
   * @param {string} userId - User ID
   * @param {string} message - Notification message
   * @param {string} type - Notification type
   */
  sendNotification(userId, message, type = NOTIFICATION_TYPE.INFO) {
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    
    // Store in history
    this._addToHistory(notification);
    
    // Dispatch to subscribers
    this._dispatchNotification(notification);
  }
  
  /**
   * Subscribe to animation status updates
   * @param {string} animationId - Animation ID to monitor
   * @param {Function} callback - Callback function for updates
   * @returns {string} - Subscription ID for unsubscribing
   */
  subscribeToAnimationStatus(animationId, callback) {
    const subscriptionId = `sub-${this.nextSubscriptionId++}`;
    
    this.subscribers.set(subscriptionId, {
      type: 'animation',
      animationId,
      callback
    });
    
    return subscriptionId;
  }
  
  /**
   * Subscribe to all notifications for a user
   * @param {string} userId - User ID
   * @param {Function} callback - Callback function for notifications
   * @returns {string} - Subscription ID for unsubscribing
   */
  subscribeToUserNotifications(userId, callback) {
    const subscriptionId = `sub-${this.nextSubscriptionId++}`;
    
    this.subscribers.set(subscriptionId, {
      type: 'user',
      userId,
      callback
    });
    
    return subscriptionId;
  }
  
  /**
   * Unsubscribe from notifications
   * @param {string} subscriptionId - Subscription ID
   * @returns {boolean} - Whether unsubscription was successful
   */
  unsubscribe(subscriptionId) {
    return this.subscribers.delete(subscriptionId);
  }
  
  /**
   * Update animation status and notify subscribers
   * @param {string} animationId - Animation ID
   * @param {string} status - New status
   * @param {Object} data - Additional status data
   */
  updateAnimationStatus(animationId, status, data = {}) {
    const statusUpdate = {
      animationId,
      status,
      timestamp: new Date(),
      ...data
    };
    
    // Notify subscribers for this animation
    for (const [id, subscription] of this.subscribers.entries()) {
      if (subscription.type === 'animation' && subscription.animationId === animationId) {
        try {
          subscription.callback(statusUpdate);
        } catch (error) {
          console.error('Error in animation status subscriber:', error);
        }
      }
    }
  }
  
  /**
   * Get notification history for a user
   * @param {string} userId - User ID
   * @returns {Array} - Notification history
   */
  getUserNotificationHistory(userId) {
    return this.notificationHistory.filter(notif => notif.userId === userId);
  }
  
  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @returns {boolean} - Whether operation was successful
   */
  markAsRead(notificationId) {
    const notification = this.notificationHistory.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }
  
  /**
   * Add notification to history
   * @param {Object} notification - Notification object
   * @private
   */
  _addToHistory(notification) {
    this.notificationHistory.unshift(notification);
    
    // Limit history size
    if (this.notificationHistory.length > this.maxHistorySize) {
      this.notificationHistory.pop();
    }
  }
  
  /**
   * Dispatch notification to subscribers
   * @param {Object} notification - Notification object
   * @private
   */
  _dispatchNotification(notification) {
    for (const [id, subscription] of this.subscribers.entries()) {
      if (
        subscription.type === 'user' && 
        subscription.userId === notification.userId
      ) {
        try {
          subscription.callback(notification);
        } catch (error) {
          console.error('Error in notification subscriber:', error);
        }
      }
    }
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;