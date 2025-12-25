const express = require('express');
const { pool } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

/**
 * GET /api/admin/movies
 * Get all movies (admin view with all fields)
 */
router.get('/movies', async (req, res) => {
  try {
    const [movies] = await pool.query(
      'SELECT * FROM movies ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      movies
    });

  } catch (error) {
    console.error('Admin get movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

/**
 * POST /api/admin/movies
 * Create a new movie
 */
router.post('/movies', async (req, res) => {
  try {
    const { title, description, source_url, thumb_url, subtitle } = req.body;

    // Validation
    if (!title || !source_url) {
      return res.status(400).json({
        success: false,
        message: 'Title and source_url are required.'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO movies (title, description, source_url, thumb_url, subtitle) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, description || null, source_url, thumb_url || null, subtitle || null]
    );

    const [newMovie] = await pool.query(
      'SELECT * FROM movies WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Movie created successfully.',
      movie: newMovie[0]
    });

  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

/**
 * PUT /api/admin/movies/:id
 * Update a movie
 */
router.put('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, source_url, thumb_url, subtitle } = req.body;

    // Check if movie exists
    const [existing] = await pool.query(
      'SELECT id FROM movies WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.'
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (source_url !== undefined) {
      updates.push('source_url = ?');
      params.push(source_url);
    }
    if (thumb_url !== undefined) {
      updates.push('thumb_url = ?');
      params.push(thumb_url);
    }
    if (subtitle !== undefined) {
      updates.push('subtitle = ?');
      params.push(subtitle);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update.'
      });
    }

    params.push(id);
    await pool.query(
      `UPDATE movies SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Get updated movie
    const [updatedMovie] = await pool.query(
      'SELECT * FROM movies WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Movie updated successfully.',
      movie: updatedMovie[0]
    });

  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

/**
 * DELETE /api/admin/movies/:id
 * Delete a movie
 */
router.delete('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if movie exists
    const [existing] = await pool.query(
      'SELECT id, title FROM movies WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.'
      });
    }

    await pool.query('DELETE FROM movies WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Movie "${existing[0].title}" deleted successfully.`
    });

  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const [moviesCount] = await pool.query('SELECT COUNT(*) as count FROM movies');
    const [usersCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [adminsCount] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");

    res.json({
      success: true,
      stats: {
        totalMovies: moviesCount[0].count,
        totalUsers: usersCount[0].count,
        totalAdmins: adminsCount[0].count
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

module.exports = router;

