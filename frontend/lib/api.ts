import axios from 'axios';
import { useAuthStore } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('API response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API response error:', error.config?.url, error);
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'admin' | 'manager' | 'user';
  }) => {
    try {
      console.log('Sending registration request to:', `${API_BASE_URL}/auth/register`);
      console.log('Registration data:', {...userData, password: '***'});
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Registration API error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      throw error;
    }
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getOverview: async (params?: {
    dateRange?: '7days' | '30days' | '90days' | 'custom';
    startDate?: string;
    endDate?: string;
    role?: 'admin' | 'manager' | 'user' | 'all';
    search?: string;
  }) => {
    const response = await api.get('/dashboard', { params });
    return response.data;
  },
  
  getAnalytics: async (params?: {
    dateRange?: '7days' | '30days' | '90days' | 'custom';
    startDate?: string;
    endDate?: string;
    role?: 'admin' | 'manager' | 'user' | 'all';
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/dashboard/analytics', { params });
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    phone?: string;
    address?: string;
    location?: string;
    district?: string;
    pincode?: string;
    state?: string;
  }) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/profile/password', passwordData);
    return response.data;
  },
};

// Students API
export const studentsAPI = {
  getStudents: async (params?: {
    search?: string;
    class?: string;
    section?: string;
    accommodationType?: 'Day Scholler' | 'Hosteller';
    transportNeeded?: boolean;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await api.get('/students', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  },
  
  getStudent: async (id: string) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch student ${id}:`, error);
      throw error;
    }
  },
  
  createStudent: async (studentData: {
    firstName: string;
    lastName: string;
    rollNumber: string;
    class: string;
    section: string;
    gender: 'Male' | 'Female' | 'Other';
    dateOfBirth: string;
    accommodationType?: 'Day Scholler' | 'Hosteller';
    transportNeeded?: boolean;
    address: string;
    location?: string;
    district?: string;
    pincode?: string;
    state?: string;
    contactNumber?: string;
    email?: string;
    parentDetails?: {
      fatherName?: string;
      fatherContact?: string;
      fatherOccupation?: string;
      motherName?: string;
      motherContact?: string;
      annualIncome?: number;
    };
    avatar?: string;
  }) => {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create student:', error);
      throw error;
    }
  },
  
  updateStudent: async (id: string, studentData: any) => {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to update student ${id}:`, error);
      throw error;
    }
  },
  
  deleteStudent: async (id: string) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to delete student ${id}:`, error);
      throw error;
    }
  },
  
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  removeAvatar: async () => {
    const response = await api.delete('/profile/avatar');
    return response.data;
  },
};

export default api; 