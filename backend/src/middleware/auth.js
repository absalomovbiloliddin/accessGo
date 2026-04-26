import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export default function auth(requiredRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token topilmadi' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      req.user = payload;

      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Ruxsat yo'q" });
      }

      return next();
    } catch {
      return res.status(401).json({ message: 'Token yaroqsiz' });
    }
  };
}
