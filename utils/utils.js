// Utility functions for the add-on

/**
 * Validate Discord token format
 */
export function validateToken(token) {
  return token && typeof token === 'string' && token.length > 20;
}

/**
 * Format timestamp to readable date
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';

  return date.toLocaleDateString();
}

/**
 * Truncate text to specified length
 */
export function truncate(text, length = 100) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitize Discord message content
 */
export function sanitizeMessage(content) {
  // Remove Discord specific formatting for basic display
  return content
    .replace(/<@!?\d+>/g, '@user') // User mentions
    .replace(/<@&\d+>/g, '@role') // Role mentions
    .replace(/<#\d+>/g, '#channel') // Channel mentions
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/`(.+?)`/g, '$1') // Code
    .substring(0, 200);
}

/**
 * Format Discord user name
 */
export function formatUserName(username) {
  return username.length > 20 ? username.substring(0, 20) + '...' : username;
}

/**
 * Get color based on status
 */
export function getStatusColor(status) {
  const colors = {
    'online': '#43b581',
    'idle': '#faa61a',
    'dnd': '#f04747',
    'offline': '#747f8d'
  };
  return colors[status] || '#747f8d';
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Make API request with retry logic
 */
export async function apiRequest(url, options = {}, retries = 3) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return apiRequest(url, options, retries - 1);
    }
    throw error;
  }
}

/**
 * Generate unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Check if premium feature is available
 */
export function isPremiumFeature(featureName) {
  const premiumFeatures = [
    'direct_messaging',
    'quick_compose',
    'auto_draft_saving',
    'channel_quick_select',
    'message_templates'
  ];
  return premiumFeatures.includes(featureName);
}

export default {
  validateToken,
  formatTime,
  truncate,
  escapeHtml,
  sanitizeMessage,
  formatUserName,
  getStatusColor,
  debounce,
  apiRequest,
  generateId,
  isPremiumFeature
};
