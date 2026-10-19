import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/authService';
import { AuthCard } from '../components/AuthCard';
import { PasswordInput } from '../components/PasswordInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlertBanner } from '../components/AlertBanner';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!location.state?.recoveryToken) {
      setError('Recovery authorization is missing. Request and verify a new code first.');
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(
        location.state.recoveryToken,
        formData.newPassword,
        formData.confirmPassword
      );

      setSuccessMsg(res.message || 'Password updated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Password reset successful. Please sign in with your new password.' },
        });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Password reset failed. Please ensure the OTP is correct.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Verify & Reset"
      subtitle="Choose a new password for your account"
      icon={ShieldAlert}
    >
      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={successMsg} onClose={() => setSuccessMsg('')} />

      <form onSubmit={handleSubmit} noValidate>
        <PasswordInput
          id="newPassword"
          label="New Password"
          placeholder="Min 8 chars, 1 uppercase, 1 symbol"
          value={formData.newPassword}
          onChange={handleChange}
          showStrengthMeter={true}
          required
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          placeholder="Enter your new password again"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <PrimaryButton
          id="btn-reset-submit"
          type="submit"
          loading={loading}
          icon={CheckCircle2}
        >
          Confirm & Update Password
        </PrimaryButton>

        <div style={styles.footer}>
          <Link to="/login" style={styles.loginLink}>
            Cancel and Return to Sign In
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

const styles = {
  footer: {
    marginTop: '28px',
    textAlign: 'center',
    fontSize: '14px',
  },
  loginLink: {
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
};
