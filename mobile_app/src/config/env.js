// Environment config for mobile app
export const ENV = {
  API_BASE_URL: (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) || 'https://bitcentral-v2.onrender.com',
  GOOGLE_WEB_CLIENT_ID: (typeof process !== 'undefined' && process.env && process.env.GOOGLE_WEB_CLIENT_ID) || '425189906555-gcjfb6co1b4duu3qpvdeq4nod56rps8n.apps.googleusercontent.com',
  ENABLE_GUEST_LOGIN: true,
};

export default ENV;

