// API configuration for Tauri app
// This allows the app to connect to the backend via local network IP

// Get API URL from environment variable or use default
// In Tauri, we can access local network IP addresses
export const getApiBaseUrl = (): string => {
  // Check if running in Tauri
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    // For Tauri, allow configuration via environment variable or use default
    // You can set this via environment variable REACT_APP_TAURI_API_URL
    const apiUrl = process.env.REACT_APP_TAURI_API_URL || 'http://192.168.1.100:8000';
    return apiUrl;
  }
  
  // For web, use empty string to use proxy
  return '';
};

// Export the API base URL
export const API_BASE_URL = getApiBaseUrl();

