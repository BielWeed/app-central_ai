import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin(email, password);
      // On success, the onAuthStateChange listener in App.tsx will handle
      // hiding the modal, so we don't need to do anything here.
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="login-modal"
      className="fixed inset-0 bg-shell-bg bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-shell-sidebar border border-shell-border rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center text-shell-text-primary mb-2">Welcome Back</h2>
        <p className="text-center text-shell-text-secondary mb-6">Sign in to continue to App Shell</p>
        
        {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-shell-text-secondary text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 bg-shell-content border border-shell-border rounded-md text-shell-text-primary focus:outline-none focus:ring-2 focus:ring-shell-accent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-shell-text-secondary text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-3 py-2 bg-shell-content border border-shell-border rounded-md text-shell-text-primary focus:outline-none focus:ring-2 focus:ring-shell-accent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-shell-accent hover:bg-shell-accent-hover text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;