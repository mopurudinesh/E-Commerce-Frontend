import React from 'react';
import { Loader2 } from 'lucide-react';

export const PrimaryButton = ({
  id,
  type = 'submit',
  children,
  loading = false,
  disabled = false,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  fullWidth = true,
  icon: Icon,
}) => {
  const getBackground = () => {
    if (variant === 'secondary') return '#ffffff';
    if (variant === 'danger') return '#dc2626';
    return 'var(--primary-500)';
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        ...styles.button,
        width: fullWidth ? '100%' : 'auto',
        background: getBackground(),
        opacity: disabled || loading ? 0.7 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        boxShadow: variant === 'primary' ? 'var(--shadow-glow)' : 'none',
      }}
    >
      {loading ? (
        <div style={styles.loadingWrapper}>
          <Loader2 size={18} className="animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        <div style={styles.contentWrapper}>
          {Icon && <Icon size={18} />}
          <span>{children}</span>
        </div>
      )}
    </button>
  );
};

const styles = {
  button: {
    height: '46px',
    padding: '0 24px',
    borderRadius: 'var(--radius-md)',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    transition: 'all 0.25s ease',
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};
