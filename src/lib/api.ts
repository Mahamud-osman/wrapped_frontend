import axios from 'axios';
import { SpotifyUser, Artist, Track, RecentTrack, UserStats } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Remove token from requests
export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// Auth endpoints
export const authApi = {
  login: () => {
    window.location.href = `${API_URL}/auth/login`;
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },
};

// User data endpoints
export const userApi = {
  getProfile: async (): Promise<SpotifyUser> => {
    const response = await api.get('/api/me');
    return response.data;
  },
  
  getTopArtists: async (timeRange = 'medium_term', limit = 20): Promise<Artist[]> => {
    const response = await api.get('/api/top-artists', {
      params: { time_range: timeRange, limit }
    });
    return response.data;
  },
  
  getTopTracks: async (timeRange = 'medium_term', limit = 20): Promise<Track[]> => {
    const response = await api.get('/api/top-tracks', {
      params: { time_range: timeRange, limit }
    });
    return response.data;
  },
  
  getRecentTracks: async (limit = 50): Promise<RecentTrack[]> => {
    const response = await api.get('/api/recent', {
      params: { limit }
    });
    return response.data;
  },
  
  getStats: async (): Promise<UserStats> => {
    const response = await api.get('/api/stats');
    return response.data;
  },
};

export default api;