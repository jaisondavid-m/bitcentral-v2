// Environment config for mobile app
export const ENV = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.bitsathy.ac.in',
  GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID || '',
  ENABLE_GUEST_LOGIN: process.env.ENABLE_GUEST_LOGIN === 'true' || true,
};

export default ENV;
