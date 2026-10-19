import React from 'react';

export const FormInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  autoComplete,
  ...rest
}) => {
  return (
    <div style={styles.group}>
      {label && (
        <label htmlFor={id} style={styles.label}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
      )}

      <div style={styles.inputWrapper}>
        {Icon && (
          <div style={styles.icon}>
            <Icon size={18} color="#64748b" />
          </div>
        )}

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{
            ...styles.input,
            paddingLeft: Icon ? '40px' : '14px',
            borderColor: error ? '#dc2626' : 'var(--border-subtle)',
          }}
          {...rest}
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
  input: {
    width: '100%',
    height: '44px',
    padding: '0 14px',
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
