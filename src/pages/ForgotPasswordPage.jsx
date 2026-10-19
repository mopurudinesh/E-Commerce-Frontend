import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlertBanner } from '../components/AlertBanner';
import { KeyRound, Mail, ArrowLeft, Send } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!identifier.trim()) {
      setError('Enter the email address or international phone number on your account.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(identifier.trim());
      setSuccessMsg(res.message || 'If an account exists, a recovery code has been sent.');
      setTimeout(() => navigate('/verify-otp', { state: { identifier: identifier.trim() } }), 800);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to process reset request. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your account email or international phone number to request a recovery code"
      icon={KeyRound}
    >
      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={successMsg} onClose={() => setSuccessMsg('')} />

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          id="identifier"
          type="text"
          label="Email or Phone Number"
          placeholder="name@example.com or +14155552671"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          icon={Mail}
          required
          autoComplete="email"
        />

        <PrimaryButton
          id="btn-forgot-submit"
          type="submit"
          loading={loading}
          icon={Send}
        >
          Send Recovery Code
        </PrimaryButton>

        <div style={styles.footer}>
          <Link to="/login" style={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Return to Sign In</span>
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
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
};
