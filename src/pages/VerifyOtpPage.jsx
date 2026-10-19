import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Hash, ShieldCheck } from 'lucide-react';
import { authService } from '../api/authService';
import { AlertBanner } from '../components/AlertBanner';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';

export const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const identifier = location.state?.identifier || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!identifier) {
      setError('Start with the forgot-password page so we know which account to verify.');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOtp(identifier, otp);
      const recoveryToken = response.data?.recoveryToken;
      if (!recoveryToken) throw new Error('The server did not return recovery authorization.');
      navigate('/reset-password', { state: { recoveryToken } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Code verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Verify Recovery Code" subtitle="Enter the 6-digit code for your account" icon={ShieldCheck}>
      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          id="otp"
          label="6-Digit Code"
          placeholder="123456"
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
          icon={Hash}
          inputMode="numeric"
          autoComplete="one-time-code"
          required
        />
        <PrimaryButton type="submit" loading={loading}>Verify Code</PrimaryButton>
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/forgot-password" style={{ color: 'var(--text-secondary)' }}>Request another code</Link>
        </p>
      </form>
    </AuthCard>
  );
};
