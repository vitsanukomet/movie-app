import { useState, useEffect } from 'react';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (searchQuery = '') => {
    try {
      setLoading(true);
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await api.get('/movies', { params });
      setMovies(response.data.movies);
      setError(null);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(search);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-pattern py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-7xl tracking-wider mb-6 animate-fade-in">
            <span className="text-white">WELCOME TO</span>{' '}
            <span className="text-gradient">MOVIEFLIX</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8 animate-fade-in animation-delay-100">
            Discover and stream your favorite movies. Join our community and enjoy unlimited entertainment.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-200">
              <Link to="/register" className="btn-primary text-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary text-lg">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Search & Movies Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pr-12 py-4"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-primary-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
          </form>

          {/* Movies Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {search ? `Search Results for "${search}"` : 'Popular Movies'}
              </h2>
              <p className="text-white/50 text-sm mt-1">
                {movies.length} movies available
              </p>
            </div>
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  fetchMovies();
                }}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 spinner"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-white/60 mb-4">{error}</p>
              <button onClick={() => fetchMovies()} className="btn-primary">
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && movies.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                </svg>
              </div>
              <p className="text-white/60">
                {search ? 'No movies found matching your search.' : 'No movies available yet.'}
              </p>
            </div>
          )}

          {/* Movies Grid */}
          {!loading && !error && movies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </div>
            <span className="font-display text-xl tracking-wider">MOVIEFLIX</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2024 MovieFlix. Built with AWS Cloud Architecture.
          </p>
          <p className="text-white/30 text-xs mt-2">
            Auto Scaling • RDS Multi-AZ • High Availability
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

