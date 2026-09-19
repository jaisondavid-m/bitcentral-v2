// Environment config for mobile app
export const ENV = {
  API_BASE_URL: (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) || 'https://bitcentral-v2.onrender.com',
  GOOGLE_WEB_CLIENT_ID: (typeof process !== 'undefined' && process.env && process.env.GOOGLE_WEB_CLIENT_ID) || '425189906555-ke5qlv5m8odqh8jhdqcqa9ek11tr8l31.apps.googleusercontent.com',
};

export default ENV;

