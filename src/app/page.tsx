'use client';

export default function Home() {
  const handleConnect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Spotify Wrapped So Far
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Discover your music listening habits for this year
        </p>
        <button
          onClick={handleConnect}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-200"
        >
          Connect with Spotify
        </button>
      </div>
    </div>
  );
}
