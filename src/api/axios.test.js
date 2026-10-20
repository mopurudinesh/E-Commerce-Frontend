import { describe, expect, it, vi } from 'vitest';
import apiClient from './axios';
import { authService } from './authService';

describe('credentialed API client', () => {
  it('fetches a CSRF token before mutations and sends it with cookie credentials', async () => {
    const seen = [];
    const previousAdapter = apiClient.defaults.adapter;
    apiClient.defaults.adapter = async (config) => {
      seen.push(config);
      return {
        data: config.url === '/csrf' ? { csrfToken: 'csrf-test-token' } : { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      };
    };
    try {
      await apiClient.put('/change-password', { currentPassword: 'old', newPassword: 'new' });
      expect(seen.map((config) => config.url)).toEqual(['/csrf', '/change-password']);
      expect(seen[1].headers['X-XSRF-TOKEN']).toBe('csrf-test-token');
      expect(seen[1].withCredentials).toBe(true);
    } finally {
      apiClient.defaults.adapter = previousAdapter;
    }
  });

  it('keeps the Change Password method and request fields aligned to the API contract', async () => {
    const spy = vi.spyOn(apiClient, 'put').mockResolvedValue({ data: { success: true } });
    await authService.changePassword('Current@123', 'NewPass@123', 'NewPass@123');
    expect(spy).toHaveBeenCalledWith('/change-password', {
      currentPassword: 'Current@123',
      newPassword: 'NewPass@123',
      confirmPassword: 'NewPass@123',
    });
  });
});
