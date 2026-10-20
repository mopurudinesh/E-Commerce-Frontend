import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { VerifyOtpPage } from './VerifyOtpPage';
import { ResetPasswordPage } from './ResetPasswordPage';
import { ChangePasswordPage } from './ChangePasswordPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

const { auth, api } = vi.hoisted(() => ({
  auth: { register: vi.fn(), login: vi.fn(), clearAuthState: vi.fn() },
  api: { forgotPassword: vi.fn(), verifyOtp: vi.fn(), resetPassword: vi.fn(), changePassword: vi.fn() },
}));

vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('../api/authService', () => ({ authService: api }));

const Probe = () => {
  const location = useLocation();
  return <div data-testid="location">{JSON.stringify({ pathname: location.pathname, state: location.state })}</div>;
};
const renderRoute = (ui, initialEntries = ['/']) => render(
  <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
);

afterEach(() => {
  vi.useRealTimers();
  cleanup();
  Object.values(auth).filter((fn) => typeof fn === 'function').forEach((fn) => fn.mockReset());
  Object.values(api).filter((fn) => typeof fn === 'function').forEach((fn) => fn.mockReset());
});

describe('authentication screens', () => {
  it('validates registration inputs and persists a valid international phone registration', async () => {
    const user = userEvent.setup();
    auth.register.mockResolvedValue({});
    renderRoute(<Routes><Route path="/" element={<RegisterPage />} /><Route path="/login" element={<Probe />} /></Routes>);
    await user.click(screen.getByRole('button', { name: /create my account/i }));
    expect(await screen.findByText(/enter a full name/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/first name/i), 'Jamie');
    await user.type(screen.getByLabelText(/last name/i), 'Taylor');
    await user.type(screen.getByLabelText(/email address/i), 'jamie@example.test');
    await user.selectOptions(screen.getByRole('combobox', { name: /phone number country/i }), 'GB');
    await user.type(screen.getByRole('textbox', { name: 'Phone Number' }), '7911123456');
    await user.type(screen.getByLabelText(/^password/i), 'Example@123');
    await user.type(screen.getByLabelText(/confirm password/i), 'Example@123');
    await user.click(screen.getByRole('button', { name: /create my account/i }));
    await waitFor(() => expect(auth.register).toHaveBeenCalledWith(expect.objectContaining({
      email: 'jamie@example.test', mobileNumber: '+447911123456', phoneRegion: 'GG',
    })));
  });

  it('shows duplicate registration errors returned by the API', async () => {
    const user = userEvent.setup();
    auth.register.mockRejectedValue({ response: { data: { message: 'An account with this email address already exists.' } } });
    renderRoute(<RegisterPage />);
    await user.type(screen.getByLabelText(/first name/i), 'Jamie');
    await user.type(screen.getByLabelText(/last name/i), 'Taylor');
    await user.type(screen.getByLabelText(/email address/i), 'jamie@example.test');
    await user.type(screen.getByRole('textbox', { name: 'Phone Number' }), '9876543210');
    await user.type(screen.getByLabelText(/^password/i), 'Example@123');
    await user.type(screen.getByLabelText(/confirm password/i), 'Example@123');
    await user.click(screen.getByRole('button', { name: /create my account/i }));
    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
  });

  it.each(['jamie@example.test', '+447911123456'])('logs in with identifier %s and shows a generic API error', async (identifier) => {
    const user = userEvent.setup();
    auth.login.mockRejectedValue({ response: { status: 401, data: { message: 'Invalid username, email, or password' } } });
    renderRoute(<LoginPage />);
    await user.type(screen.getByLabelText(/email or mobile number/i), identifier);
    await user.type(screen.getByLabelText(/password/i), 'Wrong@123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/invalid username, email, or password/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveStyle({ backgroundColor: '#fef3f2', color: '#b42318' });
  });

  it('shows registration confirmation as a green success alert on the login page', () => {
    const message = 'Registration successful! Please sign in with your new credentials.';
    renderRoute(<LoginPage />, ['/login', { pathname: '/login', state: { message } }]);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveStyle({ backgroundColor: '#ecfdf3', color: '#067647' });
  });

  it('requests recovery and navigates to OTP verification with the identifier', async () => {
    const user = userEvent.setup();
    api.forgotPassword.mockResolvedValue({ message: 'If an account exists, continue.' });
    renderRoute(<Routes><Route path="/" element={<ForgotPasswordPage />} /><Route path="/verify-otp" element={<Probe />} /></Routes>);
    await user.selectOptions(screen.getByLabelText(/recovery method/i), 'phone');
    await user.selectOptions(screen.getByRole('combobox', { name: /phone number country/i }), 'GB');
    await user.type(screen.getByRole('textbox', { name: 'Phone Number' }), '7911123456');
    await user.click(screen.getByRole('button', { name: /send recovery code/i }));
    await waitFor(() => expect(api.forgotPassword).toHaveBeenCalledWith('+447911123456'));
    expect(await screen.findByTestId('location')).toHaveTextContent('"pathname":"/verify-otp"');
  });

  it('keeps recovery authorization in navigation state and submits a reset once', async () => {
    const user = userEvent.setup();
    api.verifyOtp.mockResolvedValue({ data: { recoveryToken: 'one-time-token' } });
    api.resetPassword.mockResolvedValue({ message: 'Password reset.' });
    renderRoute(<Routes>
      <Route path="/verify" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<><Probe /><ResetPasswordPage /></>} />
    </Routes>, ['/verify', { pathname: '/verify', state: { identifier: '+447911123456' } }]);
    await user.type(screen.getByLabelText(/6-digit code/i), '123456');
    await user.click(screen.getByRole('button', { name: /verify code/i }));
    await waitFor(() => expect(api.verifyOtp).toHaveBeenCalledWith('+447911123456', '123456'));
    expect(await screen.findByTestId('location')).toHaveTextContent('one-time-token');
    expect(window.location.search).toBe('');
    await user.type(screen.getByLabelText(/^New Password/), 'Reset@789');
    await user.type(screen.getByLabelText(/confirm new password/i), 'Reset@789');
    await user.click(screen.getByRole('button', { name: /confirm & update password/i }));
    await waitFor(() => expect(api.resetPassword).toHaveBeenCalledWith('one-time-token', 'Reset@789', 'Reset@789'));
  });

  it('validates and changes password, clears client auth state and reports loading', async () => {
    const user = userEvent.setup();
    let resolveChange;
    api.changePassword.mockReturnValue(new Promise((resolve) => { resolveChange = resolve; }));
    renderRoute(<ChangePasswordPage />);
    await user.type(screen.getByLabelText(/current password/i), 'Example@123');
    await user.type(screen.getByLabelText(/^New Password/), 'Changed@123');
    await user.type(screen.getByLabelText(/confirm new password/i), 'different');
    await user.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    await user.clear(screen.getByLabelText(/confirm new password/i));
    await user.type(screen.getByLabelText(/confirm new password/i), 'Changed@123');
    await user.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/processing/i)).toBeInTheDocument();
    expect(api.changePassword).toHaveBeenCalledWith('Example@123', 'Changed@123', 'Changed@123');
    resolveChange({ message: 'Password changed successfully.' });
    expect(await screen.findByText(/password changed successfully/i)).toBeInTheDocument();
    expect(auth.clearAuthState).toHaveBeenCalledOnce();
  });

  it('redirects signed-out users away from protected routes and renders signed-in content', () => {
    const protectedRoutes = <Routes>
      <Route path="/private" element={<ProtectedRoute><div>Private content</div></ProtectedRoute>} />
      <Route path="/login" element={<div>Login page</div>} />
    </Routes>;
    auth.isAuthenticated = false;
    auth.loading = false;
    const signedOut = renderRoute(protectedRoutes, ['/private']);
    expect(screen.getByText('Login page')).toBeInTheDocument();
    signedOut.unmount();
    auth.isAuthenticated = true;
    auth.loading = false;
    renderRoute(protectedRoutes, ['/private']);
    expect(screen.getByText('Private content')).toBeInTheDocument();
  });
});
