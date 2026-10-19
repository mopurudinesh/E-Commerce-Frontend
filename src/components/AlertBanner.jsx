import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const AlertBanner = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';

  const bgColor = isError
    ? '#fef3f2'
    : isSuccess
    ? '#ecfdf3'
    : '#eff6ff';

  const borderColor = isError
    ? '#fecdca'
    : isSuccess
    ? '#abefc6'
    : '#bfdbfe';

  const textColor = isError ? '#b42318' : isSuccess ? '#067647' : '#1d5fc7';

  return (
    <div
      style={{
        ...styles.banner,
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor,
      }}
      role="alert"
    >
      <div style={styles.left}>
        {isError && <AlertCircle size={18} style={styles.icon} />}
        {isSuccess && <CheckCircle2 size={18} style={styles.icon} />}
        {!isError && !isSuccess && <Info size={18} style={styles.icon} />}
        <span style={styles.text}>{message}</span>
      </div>

      {onClose && (
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close message">
          <X size={16} color={textColor} />
        </button>
      )}
    </div>
  );
};

const styles = {
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid',
    marginBottom: '20px',
    fontSize: '14px',
    lineHeight: '1.4',
    animation: 'fadeIn 0.3s ease-out',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    flexShrink: 0,
  },
  text: {
    fontWeight: '500',
  },
  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    opacity: 0.8,
  },
};
