'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Callback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      return;
    }

    if (token) {
      // Store token with expiry timestamp (24 hours)
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
      localStorage.setItem('spotify_token', token);
      localStorage.setItem('spotify_token_expiry', expiryTime.toString());
      setStatus('success');
      setMessage('Authentication successful! Redirecting...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } else {
      setStatus('error');
      setMessage('No authentication token received');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500 mx-auto mb-4"></div>
        )}
        
        {status === 'success' && (
          <div className="text-green-500 text-6xl mb-4">✓</div>
        )}
        
        {status === 'error' && (
          <div className="text-red-500 text-6xl mb-4">✗</div>
        )}
        
        <p className="text-xl">{message}</p>
        
        {status === 'error' && (
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}