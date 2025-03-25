const config = {
  development: {
    API_BASE_URL: 'https://localhost:6291',
  },
  production: {
    API_BASE_URL: 'https://autobidder.duckdns.org:6291',
  }
};

// Export the configuration based on the environment
export default config['development']; 
