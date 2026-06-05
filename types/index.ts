export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  imdb_id?: string | null;
  media_type?: string;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  genre_ids?: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  status?: string;
  networks?: { id: number; name: string }[];
  media_type?: string;
}

/** Raw TMDB item from search/discover — all title/date fields are optional */
export interface MediaItem {
  id: number;
  media_type?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average: number;
  vote_count?: number;
  // movie
  title?: string;
  release_date?: string;
  runtime?: number;
  imdb_id?: string | null;
  // tv
  name?: string;
  first_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  // shared
  genre_ids?: number[];
  genres?: Genre[];
  tagline?: string;
  status?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface ReviewAuthorDetails {
  rating: number | null;
  avatar_path: string | null;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: ReviewAuthorDetails;
}

export interface TmdbResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
  page: number;
}
