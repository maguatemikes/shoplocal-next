/**
 * Main configuration object
 */
export const config = {
  // Base URL
  apiBaseUrl: 'https://shoplocal.kinsta.cloud',
  
  // API Endpoints
  api: {
    geodir: "https://shoplocal.kinsta.cloud/wp-json/geodir/v2",
    wordpress: "https://shoplocal.kinsta.cloud/wp-json/wp/v2",
    dokan: "https://shoplocal.kinsta.cloud/wp-json/dokan/v1",
    jwtAuth: "https://shoplocal.kinsta.cloud/wp-json/jwt-auth/v1",
    customApi: "https://shoplocal.kinsta.cloud/wp-json/custom-api/v1",
    woocommerce: "https://shoplocal.kinsta.cloud/wp-json/wc/v3", // WooCommerce REST API
  },

  // Authentication
  auth: {
    token: '',
    type: 'Bearer', // Changed from 'Basic' to 'Bearer' for JWT
    username: 'michael', // WordPress admin username
    appPassword: 'SVYOIzqhxtBwV4cIUZwQ0w8c', // WordPress Application Password
    // Pre-encoded Base64 credentials for WordPress Application Password
    // Format: base64(username:appPassword)
    // This is used for ALL API requests (creating/updating listings)
    // Even though users have their own accounts, we use admin credentials for GeoDirectory API
    // ⚠️ IMPORTANT: This will be regenerated dynamically below to ensure correct encoding
    get basicAuth() {
      // Generate fresh Base64 encoding to avoid encoding issues
      const credentials = `${this.username}:${this.appPassword}`;
      return btoa(credentials);
    },
    endpoints: {
      login: '/jwt-auth/v1/token',
      register: '/wp/v2/users',
      validate: '/jwt-auth/v1/token/validate',
      refresh: '/jwt-auth/v1/token/refresh',
    },
  },

  // WooCommerce API Configuration
  woocommerce: {
    consumerKey: 'ck_f8fce61780d20ec55f6a4d17ed0c91660a9deb1e',
    consumerSecret: 'cs_08e819686104222fedbf055fee7dc4fd5313916d',
    version: 'v3',
    // Generate WooCommerce Basic Auth header
    get authHeader() {
      const credentials = `${this.consumerKey}:${this.consumerSecret}`;
      return btoa(credentials);
    },
  },

  // Feature flags
  features: {
    geolocation: true,
    distanceCalculation: true,
    caching: true,
    maps: true,
    pagination: true,
    infiniteScroll: false,
  },

  // Caching settings
  cache: {
    ttl: 10 * 60 * 1000, // 10 minutes in milliseconds
    storageKey: 'shoplocal_cache',
    enabled: true,
  },

  // Pagination settings
  pagination: {
    defaultPerPage: 12,
    maxPerPage: 100,
  },

  // Geolocation settings
  geolocation: {
    defaultRadius: 50, // miles
    maxRadius: 500, // miles
    enableBrowserLocation: true,
    fallbackToZipCode: true,
  },

  // Map settings
  map: {
    defaultCenter: [39.8283, -98.5795] as [number, number], // Center of USA
    defaultZoom: 4,
    markerZoom: 13,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },

  // Brand colors
  colors: {
    primary: '#0EA5E9', // Sky blue
    black: '#000000',
    white: '#FFFFFF',
  },

  // UI settings
  ui: {
    buttonBorderRadius: '6px',
    containerMaxWidth: '1280px', // max-w-7xl
    animationDuration: 200,
  },

  // Typography
  typography: {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    tracking: {
      tight: '-0.025em',
      wide: '0.025em',
      normal: '0',
    },
  },

  // External APIs
  external: {
    nominatim: 'https://nominatim.openstreetmap.org',
    unsplash: 'https://source.unsplash.com',
  },

  // App metadata
  app: {
    name: 'ShopLocal',
    description: 'Comprehensive marketplace for independent sellers and wholesale offerings',
    tagline: 'Shop Premium Brands Locally',
  },

  // SEO settings
  seo: {
    titleTemplate: '%s | ShopLocal',
    defaultTitle: 'ShopLocal - Your Local Marketplace',
    defaultDescription: 'Discover premium brands and local sellers in your community',
  },

  // Vendor directory settings
  vendorDirectory: {
    categoriesEnabled: true,
    ratingsEnabled: true,
    reviewsEnabled: true,
    mapViewEnabled: true,
  },
};

/**
 * Get the authorization header for API requests
 */
export const getAuthHeader = (): string => {
  // Check localStorage for authentication tokens
  const token = localStorage.getItem('authToken');
  const wpCredentials = localStorage.getItem('wpCredentials');
  
  if (wpCredentials) {
    return `Basic ${wpCredentials}`;
  } else if (token) {
    return `Bearer ${token}`;
  } else if (config.auth.token) {
    return `Bearer ${config.auth.token}`;
  }
  
  return '';
};

/**
 * Build API URL with query parameters
 */
export const buildApiUrl = (
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string => {
  const url = new URL(`${baseUrl}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  return url.toString();
};

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

/**
 * Get API endpoint URL
 */
export const getApiUrl = (service: 'geodir' | 'wordpress' | 'dokan' | 'woocommerce'): string => {
  return config.api[service];
};

export default config;