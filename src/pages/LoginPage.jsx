import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlertBanner } from '../components/AlertBanner';
import { LogIn, User, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.message || '');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (validationErrors[id]) {
      setValidationErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.identifier.trim()) {
      errors.identifier = 'Email or mobile number is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData);
      const destination = location.state?.from?.pathname || '/home';
      navigate(destination, { replace: true });
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Authentication failed. Please check your credentials.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to access your account"
      icon={LogIn}
    >
      <AlertBanner
        type="error"
        message={error}
        onClose={() => setError('')}
      />

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          id="identifier"
          label="Email or Mobile Number"
          placeholder="e.g., user@example.com or +14155552671"
          value={formData.identifier}
          onChange={handleChange}
          error={validationErrors.identifier}
          icon={User}
          required
          autoComplete="username"
        />

        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
          required
          autoComplete="current-password"
        />

        <div style={styles.optionsRow}>
          <label style={styles.rememberLabel}>
            <input type="checkbox" style={styles.checkbox} />
            <span>Remember this device</span>
          </label>
          <Link to="/forgot-password" style={styles.forgotLink}>
            Forgot password?
          </Link>
        </div>

        <PrimaryButton
          id="btn-login-submit"
          type="submit"
          loading={loading}
          icon={Sparkles}
        >
          Sign In
        </PrimaryButton>

        <div style={styles.footer}>
          <span style={styles.footerText}>New here?</span>
          <Link to="/register" style={styles.registerLink}>
            Create an account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

const styles = {
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    fontSize: '13px',
  },
  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#2874f0',
    cursor: 'pointer',
  },
  forgotLink: {
    color: '#1d5fc7',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  footer: {
    marginTop: '28px',
    textAlign: 'center',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  footerText: {
    color: 'var(--text-secondary)',
  },
  registerLink: {
    color: '#1d5fc7',
    fontWeight: '600',
  },
};
