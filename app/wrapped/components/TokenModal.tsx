import { useState } from 'react';

interface TokenModalProps {
  onSubmit: (tokens: { accessToken: string; xcsrfToken: string; domain: string }) => void;
  isLoading?: boolean;
}

export function TokenModal({ onSubmit, isLoading = false }: TokenModalProps) {
  const [accessToken, setAccessToken] = useState('');
  const [xcsrfToken, setXcsrfToken] = useState('');
  const [domain, setDomain] = useState('fr');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ accessToken, xcsrfToken, domain });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center space-y-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-800">Loading your Vinted journey...</h2>
          <div className="space-y-3">
            <p className="text-gray-600">
              Please keep this tab open while we gather your data.
              This may take a minute or two.
            </p>
            <p className="text-sm text-gray-500">
              We're analyzing your sales history and crunching the numbers to create your personalized wrap-up.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Enter Your Vinted Tokens</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Access Token</label>
            <input
              type="text"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CSRF Token</label>
            <input
              type="text"
              value={xcsrfToken}
              onChange={(e) => setXcsrfToken(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white rounded-md py-2 hover:bg-purple-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
} 