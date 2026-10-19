import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav} aria-label="Main navigation">
      <div style={styles.container}>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            title="Sign out of your account"
            id="btn-logout"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        ) : (
          <div style={styles.authLinks}>
            <Link to="/login" style={styles.loginLink} id="nav-link-login">
              Sign In
            </Link>
            <Link to="/register" style={styles.registerBtn} id="nav-link-register">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--border-subtle)',
    padding: '12px 24px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#ffffff',
    color: '#b42318',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid #f1c7c4',
    transition: 'all 0.2s ease',
  },
  authLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  loginLink: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    transition: 'color 0.2s ease',
  },
  registerBtn: {
    padding: '8px 20px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--gradient-primary)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: 'var(--shadow-glow)',
    transition: 'transform 0.2s ease',
  },
};
