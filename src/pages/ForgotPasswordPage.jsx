import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlertBanner } from '../components/AlertBanner';
import { KeyRound, Mail, ArrowLeft, Send } from 'lucide-react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { PhoneNumberInput } from '../components/PhoneNumberInput';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [contactMethod, setContactMethod] = useState('email');
  const [phoneRegion, setPhoneRegion] = useState('IN');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!identifier.trim()) {
      setError(contactMethod === 'phone' ? 'Enter your phone number.' : 'Enter your email address.');
      return;
    }
    if (contactMethod === 'phone' && !isValidPhoneNumber(identifier)) {
      setError('Enter a valid phone number for the selected country.');
      return;
    }
    if (contactMethod === 'email' && !/^\S+@\S+\.\S+$/.test(identifier.trim())) {
      setError('Enter a valid email address.');
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
        <label htmlFor="contactMethod" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Recovery method</label>
        <select id="contactMethod" value={contactMethod} onChange={(event) => { setContactMethod(event.target.value); setIdentifier(''); setError(''); }} style={{ width: '100%', height: 44, marginBottom: 18, borderRadius: 8, padding: '0 12px' }}>
          <option value="email">Email address</option>
          <option value="phone">Phone number</option>
        </select>
        {contactMethod === 'phone' ? <PhoneNumberInput
          id="identifier"
          label="Phone Number"
          country={phoneRegion}
          onCountryChange={(region) => setPhoneRegion(region || phoneRegion)}
          value={identifier}
          onChange={(phone) => setIdentifier(phone || '')}
          error={error}
          required
        /> : <FormInput
          id="identifier"
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          icon={Mail}
          required
          autoComplete="email"
        />}

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
