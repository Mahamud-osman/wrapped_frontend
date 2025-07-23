'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import PersonalityBreakdown from '@/components/PersonalityBreakdown';
import AudioFeaturesRadar from '@/components/AudioFeaturesRadar';
import GenreDistribution from '@/components/GenreDistribution';

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  followers: { total: number };
}

interface Artist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  genres: string[];
  popularity: number;
  external_urls: { spotify: string };
}

interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  popularity: number;
  external_urls: { spotify: string };
}

interface UserStats {
  total_listening_time_ms: number;
  top_genres: Array<{
    genre: string;
    count: number;
  }>;
  listening_trends: Record<number, number>;
  average_features: Record<string, number>;
  mood_score: number;
}

interface PersonalityScore {
  category: string;
  percentage: number;
  description: string;
  traits: string[];
}

function DashboardContent() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [personalityData, setPersonalityData] = useState<PersonalityScore[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch user profile, top artists, and top tracks first
        const [userResponse, artistsResponse, tracksResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/top-artists?limit=6`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/top-tracks?limit=10`, { headers })
        ]);
        
        setUser(userResponse.data);
        setTopArtists(artistsResponse.data);
        setTopTracks(tracksResponse.data);

        // Try to fetch stats separately with error handling
        try {
          console.log('Fetching stats data...');
          const statsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`, { headers });
          console.log('Stats response:', statsResponse.data);
          setUserStats(statsResponse.data);
        } catch (statsError: any) {
          console.error('Failed to fetch stats:', statsError);
          if (statsError.response) {
            console.error('Stats error response:', statsError.response.status, statsError.response.data);
          }
          // Continue without stats - they're optional
        }

        // Try to fetch personality data
        try {
          console.log('Fetching personality data...');
          const personalityResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/personality`, { headers });
          console.log('Personality response:', personalityResponse.data);
          setPersonalityData(personalityResponse.data.personality_breakdown);
        } catch (personalityError: any) {
          console.error('Failed to fetch personality data:', personalityError);
          if (personalityError.response) {
            console.error('Personality error response:', personalityError.response.status, personalityError.response.data);
          }
          // Continue without personality data - it's optional
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load your Spotify data. Your session may have expired.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">🎵</div>
          <h1 className="text-4xl font-bold mb-4 text-green-400">Spotify Wrapped So Far</h1>
          <p className="text-xl mb-6 text-gray-300">{error}</p>
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-400">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            {user.images.length > 0 && (
              <Image
                src={user.images[0].url}
                alt={user.display_name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{user.display_name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-400">{user.followers.total} followers</p>
            </div>
          </div>
        </div>

        {/* Music Personality Section */}
        {personalityData && personalityData.length > 0 && (
          <PersonalityBreakdown personalityData={personalityData} />
        )}

        {/* Audio Features Section */}
        {userStats && userStats.average_features && (
          <AudioFeaturesRadar audioFeatures={userStats.average_features} />
        )}

        {/* Genre Distribution Section */}
        {userStats && userStats.top_genres && userStats.top_genres.length > 0 && (
          <GenreDistribution genres={userStats.top_genres} />
        )}

        {/* Stats Section */}
        {userStats && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Your Listening Stats</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total Listening Time */}
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Math.round(userStats.total_listening_time_ms / (1000 * 60 * 60))}h
                </div>
                <div className="text-gray-400">Total Listening Time</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(userStats.total_listening_time_ms / (1000 * 60))} minutes
                </div>
              </div>

              {/* Mood Score */}
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Math.round(userStats.mood_score * 100)}%
                </div>
                <div className="text-gray-400">Mood Score</div>
                <div className="text-xs text-gray-500 mt-1">
                  {userStats.mood_score > 0.7 ? '😊 Happy' : userStats.mood_score > 0.5 ? '😐 Neutral' : '😔 Chill'}
                </div>
              </div>

              {/* Energy Level */}
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Math.round((userStats.average_features.energy || 0) * 100)}%
                </div>
                <div className="text-gray-400">Energy Level</div>
                <div className="text-xs text-gray-500 mt-1">
                  {(userStats.average_features.energy || 0) > 0.7 ? '⚡ High Energy' : 
                   (userStats.average_features.energy || 0) > 0.5 ? '🔋 Medium Energy' : '🕯️ Low Energy'}
                </div>
              </div>

              {/* Danceability */}
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Math.round((userStats.average_features.danceability || 0) * 100)}%
                </div>
                <div className="text-gray-400">Danceability</div>
                <div className="text-xs text-gray-500 mt-1">
                  {(userStats.average_features.danceability || 0) > 0.7 ? '💃 Dance Party' : 
                   (userStats.average_features.danceability || 0) > 0.5 ? '🎵 Groovy' : '🎼 Chill Vibes'}
                </div>
              </div>
            </div>

            {/* Top Genres and Listening Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Genres */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-green-400">Your Top Genres</h3>
                <div className="space-y-2">
                  {userStats.top_genres.slice(0, 5).map((genre, index) => (
                    <div key={genre.genre} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-green-400 font-bold w-6">#{index + 1}</span>
                        <span className="ml-3 capitalize">{genre.genre}</span>
                      </div>
                      <div className="text-gray-400">{genre.count} artists</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Listening Trends by Hour */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-green-400">When You Listen Most</h3>
                <div className="space-y-2">
                  {Object.entries(userStats.listening_trends)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([hour, count]) => {
                      const maxCount = Math.max(...Object.values(userStats.listening_trends));
                      const percentage = (count / maxCount) * 100;
                      const timeLabel = parseInt(hour) === 0 ? '12 AM' : 
                                       parseInt(hour) === 12 ? '12 PM' :
                                       parseInt(hour) < 12 ? `${hour} AM` : `${parseInt(hour) - 12} PM`;
                      
                      return (
                        <div key={hour} className="flex items-center">
                          <div className="w-16 text-sm text-gray-400">{timeLabel}</div>
                          <div className="flex-1 bg-gray-700 rounded-full h-3 ml-3 mr-3">
                            <div 
                              className="bg-green-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-400 w-8">{count}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Artists Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Your Top Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topArtists.map((artist, index) => (
              <div key={artist.id} className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-green-400 font-bold text-lg mb-2">#{index + 1}</div>
                {artist.images.length > 0 && (
                  <Image
                    src={artist.images[0].url}
                    alt={artist.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                  />
                )}
                <h3 className="font-semibold text-lg mb-1">{artist.name}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  {artist.genres.slice(0, 2).join(', ')}
                </p>
                <div className="text-xs text-gray-500">
                  Popularity: {artist.popularity}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tracks Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Your Top Tracks</h2>
          <div className="space-y-3">
            {topTracks.map((track, index) => (
              <div key={track.id} className="bg-gray-800 rounded-lg p-4 flex items-center">
                <div className="text-green-400 font-bold text-lg w-8 text-center">
                  #{index + 1}
                </div>
                {track.album.images.length > 0 && (
                  <Image
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded ml-4 mr-4 object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{track.name}</h3>
                  <p className="text-gray-400">
                    {track.artists.map(artist => artist.name).join(', ')} • {track.album.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                    {' • '}Popularity: {track.popularity}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl text-green-400">🎉 Your Spotify Wrapped So Far!</p>
          <p className="text-gray-400 mt-2">Based on your listening habits this year</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}