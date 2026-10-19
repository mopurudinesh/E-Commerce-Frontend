import React from 'react';
import { Phone } from 'lucide-react';

export const PhoneNumberInput = ({
  id,
  label = 'Phone Number',
  countryCode = '+91',
  value,
  onChange,
  onCountryCodeChange,
  error,
  required = false,
}) => {
  return (
    <div style={styles.group}>
      <label htmlFor={id} style={styles.label}>
        {label} {required && <span style={styles.required}>*</span>}
      </label>

      <div style={styles.inputWrapper}>
        <div style={styles.icon}>
          <Phone size={18} color="#64748b" />
        </div>

        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange && onCountryCodeChange(e.target.value)}
          style={styles.select}
          aria-label="Country Code"
        >
          <option value="+91">🇮🇳 +91</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+61">🇦🇺 +61</option>
          <option value="+49">🇩🇪 +49</option>
          <option value="+971">🇦🇪 +971</option>
        </select>

        <input
          id={id}
          type="tel"
          placeholder="9876543210"
          value={value}
          onChange={onChange}
          style={{
            ...styles.input,
            borderColor: error ? '#dc2626' : 'var(--border-subtle)',
          }}
        />
      </div>

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
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  required: {
    color: '#dc2626',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  select: {
    position: 'absolute',
    left: '36px',
    height: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRight: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    paddingRight: '6px',
    outline: 'none',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    height: '44px',
    paddingLeft: '125px',
    paddingRight: '14px',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  errorText: {
    fontSize: '12px',
    color: '#dc2626',
    marginTop: '5px',
    fontWeight: '500',
  },
};
