import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.iconCircle}>
        <ShoppingBag size={48} color="#2874f0" />
      </div>
      <h1 style={styles.title}>404 — Page Not Found</h1>
      <p style={styles.desc}>
        The page you are looking for doesn't exist or has been moved to another location.
      </p>
      <Link to="/" style={styles.btn}>
        <ArrowLeft size={16} />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '24px',
  },
  iconCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: '#eef4ff',
    border: '1px solid #d8e6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '10px',
  },
  desc: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    maxWidth: '420px',
    marginBottom: '28px',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--gradient-primary)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: 'var(--shadow-glow)',
  },
};
