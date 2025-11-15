import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pluginsAPI } from '../services/api';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export const PluginOAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get OAuth parameters from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Check for OAuth errors
        if (error) {
          setStatus('error');
          setMessage(errorDescription || `OAuth error: ${error}`);
          setTimeout(() => navigate('/plugins'), 3000);
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          setStatus('error');
          setMessage('Missing required OAuth parameters');
          setTimeout(() => navigate('/plugins'), 3000);
          return;
        }

        // Get stored plugin ID and state from sessionStorage
        const pluginId = sessionStorage.getItem('oauth_plugin_id');
        const storedState = sessionStorage.getItem('oauth_state');

        if (!pluginId) {
          setStatus('error');
          setMessage('Plugin ID not found. Please try connecting again.');
          setTimeout(() => navigate('/plugins'), 3000);
          return;
        }

        // Verify state parameter to prevent CSRF attacks
        if (state !== storedState) {
          setStatus('error');
          setMessage('Invalid state parameter. Possible CSRF attack detected.');
          setTimeout(() => navigate('/plugins'), 3000);
          return;
        }

        // Exchange authorization code for access token
        setMessage('Exchanging authorization code for access token...');
        const redirectUri = `${window.location.origin}/plugins/oauth-callback`;

        await pluginsAPI.handleOAuthCallback(parseInt(pluginId), {
          code,
          state,
          redirect_uri: redirectUri,
        });

        // Clean up sessionStorage
        sessionStorage.removeItem('oauth_plugin_id');
        sessionStorage.removeItem('oauth_state');

        // Success!
        setStatus('success');
        setMessage('Plugin connected successfully! Redirecting...');
        setTimeout(() => navigate('/plugins'), 2000);
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(
          error?.response?.data?.detail ||
          error?.response?.data?.error ||
          'Failed to complete OAuth flow. Please try again.'
        );
        setTimeout(() => navigate('/plugins'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <Loader className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing...</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => navigate('/plugins')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Return to Plugins
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
