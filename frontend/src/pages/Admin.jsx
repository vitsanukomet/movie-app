import { useState, useEffect } from 'react';
import api from '../utils/api';

const Admin = () => {
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source_url: '',
    thumb_url: '',
    subtitle: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [moviesRes, statsRes] = await Promise.all([
        api.get('/admin/movies'),
        api.get('/admin/stats')
      ]);
      setMovies(moviesRes.data.movies);
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      source_url: '',
      thumb_url: '',
      subtitle: ''
    });
    setEditingMovie(null);
    setFormError('');
  };

  const handleEdit = (movie) => {
    setFormData({
      title: movie.title,
      description: movie.description || '',
      source_url: movie.source_url,
      thumb_url: movie.thumb_url || '',
      subtitle: movie.subtitle || ''
    });
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (editingMovie) {
        await api.put(`/admin/movies/${editingMovie.id}`, formData);
      } else {
        await api.post('/admin/movies', formData);
      }
      
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (movie) => {
    if (!confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      return;
    }

    try {
      await api.delete(`/admin/movies/${movie.id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete movie.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/50">Manage movies and view statistics</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Total Movies</p>
                  <p className="text-2xl font-bold text-white">{stats.totalMovies}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Total Admins</p>
                  <p className="text-2xl font-bold text-white">{stats.totalAdmins}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movies Section */}
        <div className="card">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Movies Management</h2>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Movie
            </button>
          </div>

          {/* Movies Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Movie</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {movie.thumb_url ? (
                          <img
                            src={movie.thumb_url}
                            alt={movie.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-white/10 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{movie.title}</p>
                          <p className="text-white/40 text-sm line-clamp-1 max-w-xs">
                            {movie.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/10 rounded text-sm text-white/70">
                        {movie.subtitle || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/50 text-sm">
                      {new Date(movie.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(movie)}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5 text-white/60 hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(movie)}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5 text-white/60 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {movies.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-white/40">No movies yet. Add your first movie!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Movie Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white/10 rounded transition-colors"
              >
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm text-white/70 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Movie title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[100px]"
                  placeholder="Movie description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Video URL *</label>
                <input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  className="input"
                  placeholder="https://example.com/video.mp4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumb_url}
                  onChange={(e) => setFormData({ ...formData, thumb_url: e.target.value })}
                  className="input"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Category / Genre</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="input"
                  placeholder="e.g. Action, Comedy, Drama"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary flex-1"
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 spinner mr-2"></div>
                      Saving...
                    </span>
                  ) : (
                    editingMovie ? 'Update Movie' : 'Add Movie'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

