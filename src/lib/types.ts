export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
}

export interface Artist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  genres: string[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
}

export interface Album {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  popularity: number;
  external_urls: {
    spotify: string;
  };
}

export interface AudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
}

export interface RecentTrack {
  played_at: string;
  track: Track;
}

export interface UserStats {
  total_listening_time_ms: number;
  top_genres: Array<{
    genre: string;
    count: number;
  }>;
  listening_trends: Record<number, number>;
  average_features: Record<string, number>;
  mood_score: number;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: SpotifyUser | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}