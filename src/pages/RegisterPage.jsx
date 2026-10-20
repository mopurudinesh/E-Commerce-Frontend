import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';
import { PhoneNumberInput } from '../components/PhoneNumberInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { AlertBanner } from '../components/AlertBanner';
import { UserPlus, Mail, ShieldCheck } from 'lucide-react';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneRegion: 'IN',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    if (fullName.length < 3 || fullName.length > 100) {
      errors.firstName = 'Enter a full name between 3 and 100 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!isValidPhoneNumber(formData.phoneNumber || '')) {
      errors.phoneNumber = 'Enter a valid phone number for the selected country.';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-])/.test(formData.password)) {
      errors.password = 'Must include uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      await register({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        mobileNumber: formData.phoneNumber,
        phoneRegion: formData.phoneRegion,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Redirect to login with success alert
      navigate('/login', {
        state: { message: 'Registration successful! Please sign in with your new credentials.' },
      });
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Registration failed. Please check your details.';
      
      if (err.response?.data?.validationErrors) {
        const serverErrors = err.response.data.validationErrors;
        setValidationErrors((current) => ({
          ...current,
          ...(serverErrors.fullName ? { firstName: serverErrors.fullName } : {}),
          ...(serverErrors.mobileNumber ? { phoneNumber: serverErrors.mobileNumber } : {}),
          ...(serverErrors.email ? { email: serverErrors.email } : {}),
          ...(serverErrors.password ? { password: serverErrors.password } : {}),
          ...(serverErrors.confirmPassword ? { confirmPassword: serverErrors.confirmPassword } : {}),
        }));
      }
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Create an account to continue"
      icon={UserPlus}
    >
      <AlertBanner
        type="error"
        message={error}
        onClose={() => setError('')}
      />

      <form onSubmit={handleSubmit} noValidate>
        {/* First & Last Name */}
        <div style={styles.nameRow}>
          <FormInput
            id="firstName"
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={validationErrors.firstName}
          />
          <FormInput
            id="lastName"
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={validationErrors.lastName}
          />
        </div>

        {/* Email */}
        <FormInput
          id="email"
          type="email"
          label="Email Address"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={handleChange}
          error={validationErrors.email}
          icon={Mail}
          required
          autoComplete="email"
        />

        {/* International Phone */}
        <PhoneNumberInput
          id="phoneNumber"
          label="Phone Number"
          country={formData.phoneRegion}
          onCountryChange={(region) => setFormData((p) => ({ ...p, phoneRegion: region || p.phoneRegion }))}
          value={formData.phoneNumber}
          onChange={(phoneNumber) => setFormData((p) => ({ ...p, phoneNumber: phoneNumber || '' }))}
          error={validationErrors.phoneNumber}
          required
        />

        {/* Password */}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Min 8 chars, 1 upper, 1 special"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
          showStrengthMeter={true}
          required
          autoComplete="new-password"
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={validationErrors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <PrimaryButton
          id="btn-register-submit"
          type="submit"
          loading={loading}
          icon={ShieldCheck}
        >
          Create My Account
        </PrimaryButton>

        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account?</span>
          <Link to="/login" style={styles.loginLink}>
            Sign In
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

const styles = {
  nameRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
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
  loginLink: {
    color: '#1d5fc7',
    fontWeight: '600',
  },
};
