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
    const profile = res?.data?.data || null;
    if (profile) {
      AsyncStorage.setItem('me_profile', JSON.stringify(profile)).catch(() => {});
    }
    return profile;
  } catch (err) {
    console.error('Failed to fetch profile from backend:', err?.message || err);
    try {
      const cached = await AsyncStorage.getItem('me_profile');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // ignore
    }
    return null;
  }
}

export async function getCachedMeProfile() {
  try {
    const cached = await AsyncStorage.getItem('me_profile');
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn('Failed to read me_profile from AsyncStorage:', e);
  }
  return null;
}

export async function fetchV2Profile() {
  try {
    const res = await api.get('/v2/profile');
    return res?.data?.data || res?.data || null;
  } catch (err) {
    console.error('Failed to fetch /v2/profile from backend:', err?.message || err);
    return null;
  }
}

export async function searchRpStudents(query = '') {
  try {
    const res = await api.get('/search', { params: { q: query } });
    return res?.data?.data || [];
  } catch (err) {
    console.error('Failed to search RP students:', err?.message || err);
    return [];
  }
}

export async function fetchRpRewards(rollNo = '', page = 1, limit = 10) {
  try {
    const res = await api.get('/rewards', {
      params: { roll_no: rollNo, page, limit },
    });
    return res?.data || { data: [], total: 0 };
  } catch (err) {
    console.error('Failed to fetch RP rewards:', err?.message || err);
    return { data: [], total: 0, error: err?.response?.data?.error || err?.message };
  }
}

export async function fetchRpLeaderboard(year = '', dept = '') {
  try {
    const params = {};
    if (year) params.year = year;
    if (dept) params.dept = dept;
    const res = await api.get('/top10', { params });
    return res?.data?.data || [];
  } catch (err) {
    console.error('Failed to fetch RP leaderboard:', err?.message || err);
    return [];
  }
}

export async function fetchRpAverages() {
  try {
    const res = await api.get('/averages');
    return res?.data?.averages || {};
  } catch (err) {
    console.error('Failed to fetch RP averages:', err?.message || err);
    return {};
  }
}

export async function getFeedbackMessages(markRead = false) {
  try {
    const url = markRead ? '/feedback/messages?mark_read=true' : '/feedback/messages';
    const res = await api.get(url);
    return res?.data?.data || [];
  } catch (err) {
    console.error('Failed to fetch feedback messages:', err?.message || err);
    return [];
  }
}

export async function sendFeedbackMessage(message, senderName) {
  try {
    const res = await api.post('/feedback/messages', {
      message,
      sender_name: senderName,
    });
    return res?.data?.data || null;
  } catch (err) {
    console.error('Failed to send feedback message:', err?.message || err);
    return null;
  }
}

export default api;


