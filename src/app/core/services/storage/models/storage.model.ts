/**
 * Storage key configuration for the unified storage service
 * Centralizes all storage keys used in the application
 */
export const STORAGE_KEYS = {
  COURSES: {
    LIST: 'courses:list',
    ALL: 'courses', 
    DETAILS: (id: string) => `courses:details:${id}`,
  },
  DASHBOARD: {
    DATA: 'dashboardData',
    RECENT: 'dashboard:recent',
    PREFERENCES: 'dashboard:preferences',
  },
  IMAGES: {
    LIST: 'stored_images', 
    FULL_SIZE: 'images:fullsize',
    DETAILS: (id: string) => `images:details:${id}`,
  }
};

