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

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin === '*' ? true : env.clientOrigin,
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
