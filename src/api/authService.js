import apiClient from './axios';

/**
 * Frontend API Service strictly adhering to Section 12 endpoints.
 */
export const authService = {
  // POST /api/reg
  register: async (userData) => {
    const response = await apiClient.post('/reg', userData);
    return response.data;
  },

  // POST /api/login
  login: async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },

  // POST /api/logout
  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },

  // GET /api/me
  getCurrentUser: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  // GET /api/home
  getHome: async () => {
    const response = await apiClient.get('/home');
    return response.data;
  },

  // POST /api/forgot-password
  forgotPassword: async (identifier) => {
    const response = await apiClient.post('/forgot-password', { identifier });
    return response.data;
  },

  // POST /api/verify-otp
  verifyOtp: async (identifier, otp) => {
    const response = await apiClient.post('/verify-otp', { identifier, otp });
    return response.data;
  },

  // POST /api/reset-password
  resetPassword: async (recoveryToken, newPassword, confirmPassword) => {
    const response = await apiClient.post('/reset-password', {
      recoveryToken,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  // PUT /api/change-password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const response = await apiClient.put('/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};
