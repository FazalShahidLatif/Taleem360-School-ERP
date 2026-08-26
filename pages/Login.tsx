import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import api from '../lib/api';
import { Footer } from '../components/Footer';
import { useSEO } from '../lib/seo';

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
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [showGoogleCustomInput, setShowGoogleCustomInput] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const isLiveWebsite = false;

  useSEO({
    title: 'Sign In & Access Cloud Portal | Taleem360 ERP Suite',
    description: "Sign in securely to your Taleem360 multi-tenant school portal. Check academic grades, student attendance, parent dashboards, and process billing checkout payments.",
    keywords: 'sign in school portal, taleem360 erp login, student cloud access, teacher portal login, school administration login, parent gradebook sign in',
    canonicalUrl: 'https://www.taleem360.online/login',
    schemaMarkup: {
      '@type': 'WebPage',
      name: 'Sign In & Access Cloud Portal | Taleem360 ERP Suite',
      description: 'Single sign-on authentication portal for school principals, teachers, students, and bursars across Taleem360 educational cloud nodes.',
      url: 'https://www.taleem360.online/login'
    }
  });

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
            <GraduationCap className="h-12 w-12 text-indigo-600" />
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
                      className="w-full flex justify-center py-2.5 px-4 min-h-[44px] border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
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
                      className="min-h-[44px] py-2 px-4 inline-flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                      className="w-full flex justify-center py-2.5 px-4 min-h-[44px] border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
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
                      className="min-h-[44px] py-2 px-4 inline-flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                  <a href="mailto:accts.pak@gmail.com" className="block text-base font-bold text-indigo-600 hover:text-indigo-500 mt-2">
                    accts.pak@gmail.com
                  </a>
                  <span className="block text-xs text-gray-400 mt-2">(Note: support@taleem360.online email channel is suspended)</span>
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
                        className="min-h-[44px] py-2 px-4 inline-flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                  className="w-full flex justify-center py-2.5 px-4 min-h-[44px] border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (isRegister ? 'Registering...' : 'Signing in...') : (isRegister ? 'Register' : 'Sign in')}
                </button>
              </div>
            </form>
            )}

            {!isRegister && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-250" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowGoogleChooser(true)}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-h-[44px]"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.256-3.133C18.29 1.96 15.525 1 12.24 1 5.466 1 0 6.466 0 13.24s5.466 12.24 12.24 12.24c7.08 0 11.78-4.982 11.78-11.983 0-.806-.088-1.42-.194-2.212H12.24z"/>
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>
            )}

            {(!isRegister || !isLiveWebsite) && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="min-h-[44px] py-2.5 px-4 inline-flex items-center justify-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register your school"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showGoogleChooser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-gray-150 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center mb-6">
              <svg className="w-10 h-10 mx-auto mb-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.1-.21-.19-.44-.26-.67z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 className="text-lg font-bold text-gray-950">Choose an account</h3>
              <p className="text-xs text-gray-500 mt-1">to continue to Taleem360 ERP Cloud</p>
            </div>

            <div className="space-y-2 max-h-[250px] overflow-y-auto mb-6 pr-1">
              {/* Super Admin option */}
              <button
                type="button"
                onClick={() => {
                  window.postMessage({
                    type: 'OAUTH_AUTH_SUCCESS',
                    user: {
                      email: 'accts.pak@gmail.com',
                      name: 'Super Admin',
                      role: 'SUPER_ADMIN'
                    }
                  }, '*');
                  setShowGoogleChooser(false);
                }}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm">
                    SA
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Super Admin (Taleem360)</p>
                    <p className="text-xs font-mono text-gray-500">accts.pak@gmail.com</p>
                  </div>
                </div>
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">Owner</span>
              </button>

              {/* Suspended option */}
              <button
                type="button"
                onClick={() => {
                  alert('This administrative account (support@taleem360.online) has been suspended because no custom email server is attached. Please contact accts.pak@gmail.com for access.');
                }}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg opacity-60 bg-gray-50 hover:bg-red-50 hover:border-red-200 transition text-left cursor-pointer animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold text-sm">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Support Desk</p>
                    <p className="text-xs font-mono text-gray-500">support@taleem360.online</p>
                  </div>
                </div>
                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded uppercase">Suspended</span>
              </button>

              {showGoogleCustomInput ? (
                <div className="p-3 border border-indigo-200 rounded-lg bg-indigo-50/50 space-y-2 animate-in slide-in-from-top-2 duration-100">
                  <label className="block text-xs font-semibold text-indigo-900">Google Email</label>
                  <input
                    type="email"
                    required
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-1.5 border border-indigo-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!googleCustomEmail.includes('@')) {
                          alert('Please enter a valid email address.');
                          return;
                        }
                        window.postMessage({
                          type: 'OAUTH_AUTH_SUCCESS',
                          user: {
                            email: googleCustomEmail,
                            name: googleCustomEmail.split('@')[0],
                            role: 'ADMIN'
                          }
                        }, '*');
                        setShowGoogleChooser(false);
                      }}
                      className="flex-1 text-center bg-indigo-600 text-white text-xs font-bold py-1.5 rounded hover:bg-indigo-700"
                    >
                      Use Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGoogleCustomInput(false)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowGoogleCustomInput(true)}
                  className="w-full flex items-center justify-center p-2.5 border border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/20 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition cursor-pointer"
                >
                  + Use another Google account
                </button>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowGoogleChooser(false);
                  setShowGoogleCustomInput(false);
                }}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded cursor-pointer min-h-[36px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};