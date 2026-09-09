import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from '../config/env';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to retrieve auth_token from AsyncStorage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function postGoogleAuth(payload) {
  try {
    const requestData = typeof payload === 'string' ? { credential: payload } : payload;
    requestData.client_id = ENV.GOOGLE_WEB_CLIENT_ID;

    // Call mobile app dedicated google auth endpoint first
    try {
      const res = await api.post('/auth/mobile/google', requestData);
      if (res?.data && res.data.success) {
        return res.data;
      }
    } catch (mobileErr) {
      console.warn('Endpoint /auth/mobile/google unavailable, trying /auth/google fallback...');
    }

    const res = await api.post('/auth/google', requestData);
    return res.data;
  } catch (err) {
    console.error('Backend Google Auth error:', err?.response?.data || err?.message || err);
    const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Authentication request failed';
    return { success: false, error: errorMessage };
  }
}

export async function fetchHomeCards() {
  try {
    const res = await api.get('/cards');
    return res?.data?.data || res?.data || [];
  } catch (err) {
    console.error('Failed to fetch home cards from backend:', err?.message || err);
    return [];
  }
}

export async function fetchFacultyDirectory(query = '', department = '') {
  try {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (department) params.set('dept', department);
    const res = await api.get(`/faculty-directory?${params.toString()}`);
    return res?.data || { success: false, data: [] };
  } catch (err) {
    console.error('Failed to fetch faculty directory from backend:', err?.message || err);
    return { success: false, data: [] };
  }
}

export async function fetchMessMenu(hostel = 'boys', date = '') {
  try {
    const params = {};
    if (hostel) params.hostel = hostel;
    if (date) params.date = date;
    const res = await api.get('/mess', { params });
    return res?.data || null;
  } catch (err) {
    console.error('Failed to fetch mess menu from backend:', err?.message || err);
    return null;
  }
}

export async function sendChatMessage({ message, history = [], rollNo = '' }) {
  try {
    const res = await api.post('/api/chat', {
      message,
      history,
      roll_no: rollNo,
    });
    return res.data;
  } catch (err) {
    console.error('AI Chat API failed:', err?.message || err);
    return {
      success: false,
      message: '⚠️ Unable to connect to BitBot AI service. Check connection or try again later.',
    };
  }
}

export async function fetchMeProfile() {
  try {
    const res = await api.get('/me');
    return res?.data?.data || null;
  } catch (err) {
    console.error('Failed to fetch profile from backend:', err?.message || err);
    return null;
  }
}

export default api;

