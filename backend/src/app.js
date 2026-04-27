import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env.js';

import authRoutes from './routes/authRoutes.js';
import ridesRoutes from './routes/ridesRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import driverRoutes from './routes/driverRoutes.js';

const app = express();
const configuredOrigins = (env.clientOrigin || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const devOrigins = ['http://localhost:19006', 'http://localhost:8081'];
const allowAllOrigins = env.clientOrigin === '*';
const allowedOrigins = new Set([
  ...configuredOrigins,
  ...(env.nodeEnv === 'development' ? devOrigins : [])
]);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowAllOrigins || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/rides', ridesRoutes);
app.use('/payment', paymentRoutes);
app.use('/driver', driverRoutes);

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message || 'Server xatoligi' });
});

export default app;
