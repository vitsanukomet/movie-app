const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/movies
 * Get all movies (public access or authenticated)
 */
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT id, title, description, source_url, thumb_url, subtitle, created_at FROM movies';
    let params = [];

    if (search) {
      query += ' WHERE title LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [movies] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM movies';
    let countParams = [];
    if (search) {
      countQuery += ' WHERE title LIKE ? OR description LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      success: true,
      movies,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

/**
 * GET /api/movies/:id
 * Get single movie by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [movies] = await pool.execute(
      'SELECT id, title, description, source_url, thumb_url, subtitle, created_at FROM movies WHERE id = ?',
      [id]
    );

    if (movies.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.'
      });
    }

    res.json({
      success: true,
      movie: movies[0]
    });

  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

module.exports = router;

