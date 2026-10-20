import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { authService } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import { AlertBanner } from '../components/AlertBanner';
import { AuthCard } from '../components/AuthCard';
import { PasswordInput } from '../components/PasswordInput';
import { PrimaryButton } from '../components/PrimaryButton';

const passwordPolicy = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).{8,100}$/;

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { clearAuthState } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setForm((current) => ({ ...current, [id]: value }));
    setErrors((current) => ({ ...current, [id]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const nextErrors = {};
    if (!form.currentPassword) nextErrors.currentPassword = 'Enter your current password.';
    if (!passwordPolicy.test(form.newPassword)) {
      nextErrors.newPassword = 'Use 8–100 characters with uppercase, lowercase, a number, and a supported symbol.';
    }
    if (form.newPassword !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.changePassword(
        form.currentPassword,
        form.newPassword,
        form.confirmPassword,
      );
      setSuccess(response.message || 'Password changed. All sessions have been signed out.');
      // Backend revokes every session, including this one, so clear local auth state too.
      clearAuthState();
      window.setTimeout(() => navigate('/login', {
        replace: true,
        state: { message: 'Password changed. Please sign in again with your new password.' },
      }), 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to change the password. Check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Change Password" subtitle="Update your account password" icon={KeyRound}>
      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />
      <form onSubmit={handleSubmit} noValidate>
        <PasswordInput id="currentPassword" label="Current Password" value={form.currentPassword} onChange={handleChange} error={errors.currentPassword} autoComplete="current-password" required />
        <PasswordInput id="newPassword" label="New Password" value={form.newPassword} onChange={handleChange} error={errors.newPassword} autoComplete="new-password" required />
        <PasswordInput id="confirmPassword" label="Confirm New Password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" required />
        <PrimaryButton type="submit" loading={loading} icon={KeyRound}>Update Password</PrimaryButton>
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/home" style={{ color: '#1d5fc7', display: 'inline-flex', alignItems: 'center', gap: 6 }}><ArrowLeft size={16} /> Back to Home</Link>
        </p>
      </form>
    </AuthCard>
  );
};
