import express from 'express';
import auth from '../middleware/auth.js';
import pool from '../db/pool.js';

const router = express.Router();

router.get('/earnings', auth(['driver']), async (req, res) => {
  try {
    const summary = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'completed')::INT AS completed_rides,
         COALESCE(SUM(fare_uzs) FILTER (WHERE status = 'completed'), 0)::INT AS total_earnings,
         COALESCE(AVG(fare_uzs) FILTER (WHERE status = 'completed'), 0)::INT AS avg_fare
       FROM rides
       WHERE driver_id = $1`,
      [req.user.id]
    );

    const weekly = await pool.query(
      `SELECT DATE_TRUNC('day', completed_at) AS day,
              COALESCE(SUM(fare_uzs), 0)::INT AS earnings
       FROM rides
       WHERE driver_id = $1
       AND status = 'completed'
       AND completed_at >= NOW() - INTERVAL '7 days'
       GROUP BY 1
       ORDER BY 1 ASC`,
      [req.user.id]
    );

    return res.json({
      summary: summary.rows[0],
      weekly: weekly.rows
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
