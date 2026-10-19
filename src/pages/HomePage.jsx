import React, { useEffect } from 'react';
import { authService } from '../api/authService';

export const HomePage = () => {
  useEffect(() => {
    // Request the protected home endpoint so the page uses the authenticated session.
    authService.getHome().catch((error) => {
      console.error('Failed to load the protected home page:', error);
    });
  }, []);

  return (
    <section className="welcome-page" aria-labelledby="welcome-title">
      <div className="welcome-content">
        <h1 id="welcome-title">Welcome to Home Page!</h1>
        <p>You have successfully logged in.</p>
      </div>
    </section>
  );
};
