import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MovieCard = ({ movie, index }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div 
      className="card-hover group animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {movie.thumb_url ? (
          <img 
            src={movie.thumb_url} 
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-200 to-dark-300 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            {isAuthenticated ? (
              <Link 
                to={`/watch/${movie.id}`}
                className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-primary-500/50"
              >
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </Link>
            ) : (
              <Link 
                to="/login"
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 border border-white/20"
              >
                Login to Watch
              </Link>
            )}
          </div>
        </div>

        {/* Category Badge */}
        {movie.subtitle && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/80">
            {movie.subtitle}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-white/50 line-clamp-2">
          {movie.description || 'No description available.'}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;

