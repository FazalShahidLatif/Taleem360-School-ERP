import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import api from '../lib/api';
import { Footer } from '../components/Footer';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetFlowToken, setResetFlowToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordResetCompleted, setPasswordResetCompleted] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const isLiveWebsite = typeof window !== 'undefined' && (window.location.hostname === 'taleem360.online' || window.location.hostname === 'www.taleem360.online');

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetSuccessMessage('');

    try {
      const response = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setResetSuccessMessage(data.detail || 'Password reset link has been dispatched to your email address successfully.');
        if (data.exists && data.token) {
          // Store token to enable immediate direct setup input
          setResetFlowToken(data.token);
        }
      } else {
        setError(data.detail || 'Failed to dispatch password reset request.');
      }
    } catch (err: any) {
      setError(err.message || 'Connecting error.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 3) {
      setError('Password must be at least 3 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setResetSuccessMessage('');

    try {
      const response = await fetch('/api/auth/password-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail,
          token: resetFlowToken,
          newPassword: newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setResetSuccessMessage(data.detail || 'Password updated successfully!');
        setPasswordResetCompleted(true);
        
        // Auto sign in user or route back with credentials prepared in form
        setTimeout(() => {
          setIsReset(false);
          setResetFlowToken('');
          setError('');
          setResetSuccessMessage('');
          setPasswordResetCompleted(false);
          setEmail(resetEmail);
          setPassword(newPassword);
        }, 2000);
      } else {
        setError(data.detail || 'Failed to update password.');
      }
    } catch (err: any) {
      setError(err.message || 'Connecting error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        await register(name, email, password);
        navigate('/onboarding');
      } else {
        const success = await login(email, password);
        if (success) {
          // Precise context routing based on user role to corresponding dashboards
          const token = localStorage.getItem("access_token");
          let destination = '/';
          if (token) {
            try {
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
              const payload = JSON.parse(jsonPayload);
              const userRole = payload.role; // uppercase role: ADMIN, TEACHER, PARENT, SUPER_ADMIN

              if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
                console.log('[Auth Routing] Redirecting Administrator to School Management dashboard');
                destination = '/'; // Mounts the Admin Dashboard containing all ERP panels
              } else if (userRole === 'TEACHER') {
                console.log('[Auth Routing] Redirecting Faculty to Staff portal');
                destination = '/'; // Mounts the Staff portal dashboard
              } else if (userRole === 'PARENT') {
                console.log('[Auth Routing] Redirecting Student/Parent to educational dashboard');
                destination = '/'; // Mounts student student profile & reports tracker
              }
            } catch (err) {
              console.error('[Auth Routing] Error parsing token on routing dispatch', err);
            }
          }
          navigate(destination);
        } else {
          setError('Invalid email or password');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillCreds = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <School className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isReset ? 'Reset your password' : isRegister ? 'Register your school' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Taleem360-School ERP
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isReset ? (
              resetFlowToken ? (
                <form className="space-y-6" onSubmit={handlePasswordUpdateSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-indigo-700 font-semibold mb-2 bg-indigo-50 p-3 rounded border border-indigo-150">
                      Direct Set Active: Your account has been verified. Define your new password below to instantly update.
                    </label>
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="new-password"
                        name="new-password"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Choose a strong password"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirm-new-password"
                        name="confirm-new-password"
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Re-enter your password"
                      />
                    </div>
                  </div>

                  {resetSuccessMessage && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      {resetSuccessMessage}
                    </div>
                  )}

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={loading || passwordResetCompleted}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : passwordResetCompleted ? 'Saved successfully!' : 'Save New Password'}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsReset(false);
                        setResetFlowToken('');
                        setError('');
                        setResetSuccessMessage('');
                        setPasswordResetCompleted(false);
                      }}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={handleResetSubmit}>
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="reset-email"
                        name="reset-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {resetSuccessMessage && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                      {resetSuccessMessage}
                    </div>
                  )}

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Sending link...' : 'Send reset link'}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsReset(false);
                        setError('');
                        setResetSuccessMessage('');
                      }}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )
            ) : isRegister && isLiveWebsite ? (
              <div className="space-y-6 text-center py-4">
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 text-amber-900 text-sm leading-relaxed shadow-sm">
                  <p className="font-bold text-lg text-amber-800 mb-2">Registration Restricted</p>
                  Self-service school registration is restricted on the live website. If you represent an educational institution, please reach out to our onboarding team to establish your school's dashboard.
                </div>
                <div className="text-gray-600 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
                  Send your onboarding request details to: 
                  <a href="mailto:support@taleem360.online" className="block text-base font-bold text-indigo-600 hover:text-indigo-500 mt-2">
                    support@taleem360.online
                  </a>
                </div>
                <button
                  onClick={() => setIsRegister(false)}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {isRegister && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {!isRegister && (
                  <div className="flex items-center justify-end">
                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setIsReset(true);
                          setError('');
                          setResetSuccessMessage('');
                          setResetEmail(email);
                        }}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </div>
                )}

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (isRegister ? 'Registering...' : 'Signing in...') : (isRegister ? 'Register' : 'Sign in')}
                </button>
              </div>
            </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register your school"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};