import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export const PasswordInput = ({
  id,
  label,
  placeholder = '••••••••',
  value,
  onChange,
  error,
  required = false,
  showStrengthMeter = false,
  autoComplete = 'current-password',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Calculate password strength score (0-4)
  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&#^~_-]/.test(pwd)) score++;
    return score;
  };

  const strength = calculateStrength(value);

  const getStrengthLabel = (score) => {
    switch (score) {
      case 0: return { label: 'Too short', color: '#64748b' };
      case 1: return { label: 'Weak', color: '#dc2626' };
      case 2: return { label: 'Fair', color: '#f59e0b' };
      case 3: return { label: 'Good', color: '#2874f0' };
      case 4: return { label: 'Strong', color: '#10b981' };
      default: return { label: '', color: '' };
    }
  };

  const strengthInfo = getStrengthLabel(strength);

  return (
    <div style={styles.group}>
      {label && (
        <div style={styles.labelRow}>
          <label htmlFor={id} style={styles.label}>
            {label} {required && <span style={styles.required}>*</span>}
          </label>
          {showStrengthMeter && value && (
            <span style={{ ...styles.strengthBadge, color: strengthInfo.color }}>
              {strengthInfo.label}
            </span>
          )}
        </div>
      )}

      <div style={styles.inputWrapper}>
        <div style={styles.iconLeft}>
          <Lock size={18} color="#64748b" />
        </div>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{
            ...styles.input,
            borderColor: error ? '#dc2626' : 'var(--border-subtle)',
          }}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={styles.toggleBtn}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
        </button>
      </div>

      {showStrengthMeter && value && (
        <div style={styles.strengthBarContainer}>
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              style={{
                ...styles.strengthSegment,
                backgroundColor: level <= strength ? strengthInfo.color : '#e2e8f0',
              }}
            />
          ))}
        </div>
      )}

      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

const styles = {
  group: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '18px',
    textAlign: 'left',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  required: {
    color: '#dc2626',
  },
  strengthBadge: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  iconLeft: {
    position: 'absolute',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    height: '44px',
    paddingLeft: '40px',
    paddingRight: '44px',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  toggleBtn: {
    position: 'absolute',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
  },
  strengthBarContainer: {
    display: 'flex',
    gap: '4px',
    marginTop: '6px',
  },
  strengthSegment: {
    height: '4px',
    flex: 1,
    borderRadius: '2px',
    transition: 'background-color 0.25s ease',
  },
  errorText: {
    fontSize: '12px',
    color: '#dc2626',
    marginTop: '5px',
    fontWeight: '500',
  },
};
