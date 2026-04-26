import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';
import env from '../config/env.js';

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
      fullName: user.full_name
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { fullName, phone, password, role = 'customer' } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: 'fullName, phone, password majburiy' });
    }

    if (!['customer', 'driver'].includes(role)) {
      return res.status(400).json({ message: "role noto'g'ri" });
    }

    const existing = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length) {
      return res.status(409).json({ message: "Bu telefon oldin ro'yxatdan o'tgan" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (full_name, phone, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, phone, role, created_at`,
      [fullName, phone, passwordHash, role]
    );

    const user = result.rows[0];
    const token = signToken(user);

    return res.status(201).json({
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: 'phone va password majburiy' });
    }

    const result = await pool.query(
      'SELECT id, full_name, phone, password_hash, role FROM users WHERE phone = $1',
      [phone]
    );

    if (!result.rows.length) {
      return res.status(401).json({ message: 'Login yoki parol xato' });
    }

    const user = result.rows[0];
    const matches = await bcrypt.compare(password, user.password_hash);

    if (!matches) {
      return res.status(401).json({ message: 'Login yoki parol xato' });
    }

    const token = signToken(user);

    return res.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
