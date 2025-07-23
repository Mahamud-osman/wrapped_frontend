import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    const tokenExpiry = localStorage.getItem('spotify_token_expiry');
    
    if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
      // Clear any invalid/expired tokens
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_token_expiry');
      localStorage.removeItem('spotify_user');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not authenticated - show login page
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">🎵</div>
          <h1 className="text-4xl font-bold mb-4 text-green-400">Spotify Wrapped So Far</h1>
          <p className="text-xl mb-6 text-gray-300">Please connect your Spotify account to continue</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-200"
          >
            Connect with Spotify
          </button>
        </div>
      </div>
    );
  }

  // Authenticated - show protected content
  return <>{children}</>;
}