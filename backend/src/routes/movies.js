const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

/**
 * GET /api/movies
 * Get all movies
 */
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    let query = 'SELECT id, title, description, source_url, thumb_url, subtitle, created_at FROM movies';
    let params = [];

    if (search) {
      query += ' WHERE title LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Use query() instead of execute() for LIMIT/OFFSET (MySQL prepared statements don't support these as params)
    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [movies] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM movies';
    if (search) {
      countQuery += ' WHERE title LIKE ? OR description LIKE ?';
      const [countResult] = await pool.query(countQuery, [`%${search}%`, `%${search}%`]);
      return res.json({
        success: true,
        movies,
        pagination: { total: countResult[0].total, limit, offset }
      });
    }
    
    const [countResult] = await pool.query(countQuery);

    res.json({
      success: true,
      movies,
      pagination: { total: countResult[0].total, limit, offset }
    });

  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

/**
 * GET /api/movies/:id
 * Get single movie by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [movies] = await pool.query(
      'SELECT id, title, description, source_url, thumb_url, subtitle, created_at FROM movies WHERE id = ?',
      [id]
    );

    if (movies.length === 0) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    res.json({ success: true, movie: movies[0] });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
