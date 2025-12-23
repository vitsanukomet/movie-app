import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/movies/${id}`);
      setMovie(response.data.movie);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Movie not found.');
      } else {
        setError('Failed to load movie. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p className="text-white/60 mb-4">{error}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <video
          className="absolute inset-0 w-full h-full bg-black"
          src={movie.source_url}
          controls
          autoPlay
          poster={movie.thumb_url}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Movie Info */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Back</span>
        </button>

        <div className="card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Thumbnail */}
            {movie.thumb_url && (
              <div className="sm:w-64 flex-shrink-0">
                <img
                  src={movie.thumb_url}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Details */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {movie.title}
              </h1>
              
              {movie.subtitle && (
                <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm mb-4">
                  {movie.subtitle}
                </span>
              )}

              <p className="text-white/60 leading-relaxed mb-6">
                {movie.description || 'No description available.'}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const video = document.querySelector('video');
                    if (video) video.requestFullscreen();
                  }}
                  className="btn-secondary"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                  Full Screen
                </button>

                <Link to="/" className="btn-secondary">
                  <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                  Browse More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;

