import express from 'express';
import pool from '../db/pool.js';
import auth from '../middleware/auth.js';
import { getRouteInfo } from '../services/fareService.js';

const router = express.Router();

router.post('/estimate', auth(['customer']), async (req, res) => {
  try {
    const { pickup, dropoff } = req.body;
    if (!pickup || !dropoff) {
      return res.status(400).json({ message: 'pickup va dropoff majburiy' });
    }

    const routeInfo = await getRouteInfo(
      { lat: pickup.lat, lng: pickup.lng },
      { lat: dropoff.lat, lng: dropoff.lng }
    );

    return res.json(routeInfo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/request', auth(['customer']), async (req, res) => {
  try {
    const { pickup, dropoff } = req.body;

    if (!pickup || !dropoff) {
      return res.status(400).json({ message: 'pickup va dropoff majburiy' });
    }

    const routeInfo = await getRouteInfo(
      { lat: pickup.lat, lng: pickup.lng },
      { lat: dropoff.lat, lng: dropoff.lng }
    );

    const rideResult = await pool.query(
      `INSERT INTO rides (
        customer_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng,
        pickup_address, dropoff_address, distance_km, estimated_duration_min, fare_uzs
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        req.user.id,
        pickup.lat,
        pickup.lng,
        dropoff.lat,
        dropoff.lng,
        pickup.address,
        dropoff.address,
        routeInfo.distanceKm,
        routeInfo.durationMin,
        routeInfo.fareUzs
      ]
    );

    return res.status(201).json({ ride: rideResult.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/active', auth(['customer', 'driver']), async (req, res) => {
  try {
    const params = [req.user.id];
    const userFilter =
      req.user.role === 'customer'
        ? 'r.customer_id = $1'
        : "r.driver_id = $1 OR (r.driver_id IS NULL AND r.status = 'requested')";

    const query = `
      SELECT r.*,
      c.full_name AS customer_name,
      d.full_name AS driver_name,
      d.phone AS driver_phone
      FROM rides r
      JOIN users c ON c.id = r.customer_id
      LEFT JOIN users d ON d.id = r.driver_id
      WHERE (${userFilter})
      AND r.status IN ('requested','accepted','arrived','in_progress')
      ORDER BY r.requested_at DESC
      LIMIT 1
    `;

    const result = await pool.query(query, params);
    return res.json({ ride: result.rows[0] || null });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', auth(['customer', 'driver']), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['accepted', 'arrived', 'in_progress', 'completed', 'cancelled', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "status noto'g'ri" });
    }

    const rideRes = await client.query('SELECT * FROM rides WHERE id = $1 FOR UPDATE', [id]);
    if (!rideRes.rows.length) {
      return res.status(404).json({ message: 'Ride topilmadi' });
    }

    const ride = rideRes.rows[0];

    if (req.user.role === 'customer' && ride.customer_id !== req.user.id) {
      return res.status(403).json({ message: 'Bu ride sizga tegishli emas' });
    }

    if (req.user.role === 'driver' && status === 'accepted') {
      if (ride.driver_id && ride.driver_id !== req.user.id) {
        return res.status(409).json({ message: 'Ride allaqachon boshqa haydovchi olgan' });
      }
    }

    const updates = ['status = $1', 'updated_at = NOW()'];
    const values = [status];

    if (status === 'accepted') {
      updates.push('driver_id = $2', 'accepted_at = NOW()');
      values.push(req.user.id);
    }

    if (status === 'in_progress') updates.push('started_at = NOW()');
    if (status === 'completed') updates.push('completed_at = NOW()');
    if (status === 'cancelled' || status === 'rejected') updates.push('cancelled_at = NOW()');

    const valueIndex = values.length + 1;
    values.push(id);

    const sql = `UPDATE rides SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`;
    const updated = await client.query(sql, values);

    await client.query('COMMIT');
    return res.json({ ride: updated.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

router.get('/history', auth(['customer', 'driver']), async (req, res) => {
  try {
    const query =
      req.user.role === 'customer'
        ? `SELECT r.*, d.full_name AS driver_name FROM rides r
           LEFT JOIN users d ON d.id = r.driver_id
           WHERE r.customer_id = $1 AND r.status IN ('completed','cancelled','rejected')
           ORDER BY r.updated_at DESC`
        : `SELECT r.*, c.full_name AS customer_name FROM rides r
           JOIN users c ON c.id = r.customer_id
           WHERE r.driver_id = $1 AND r.status IN ('completed','cancelled','rejected')
           ORDER BY r.updated_at DESC`;

    const result = await pool.query(query, [req.user.id]);
    return res.json({ rides: result.rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
