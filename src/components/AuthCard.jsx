import React from 'react';

export const AuthCard = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Card Header */}
        <div style={styles.header}>
          {Icon && (
            <div style={styles.iconContainer}>
              <Icon size={24} color="#2874f0" />
            </div>
          )}
          <h1 style={styles.title}>{title}</h1>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* Form Body */}
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    position: 'relative',
    zIndex: 1,
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '460px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '36px 32px',
    boxShadow: 'var(--shadow-card)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  iconContainer: {
    width: '54px',
    height: '54px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: '#eef4ff',
    border: '1px solid #d8e6ff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  body: {
    position: 'relative',
    zIndex: 2,
  },
};
