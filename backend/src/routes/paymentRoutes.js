import express from 'express';
import auth from '../middleware/auth.js';
import { initiatePayment } from '../services/paymentService.js';

const router = express.Router();

router.post('/initiate', auth(['customer']), async (req, res) => {
  try {
    const { rideId, method } = req.body;
    if (!rideId || !method) {
      return res.status(400).json({ message: 'rideId va method majburiy' });
    }

    if (!['click', 'payme', 'cash'].includes(method)) {
      return res.status(400).json({ message: "method faqat click/payme/cash bo'lishi mumkin" });
    }

    const response = await initiatePayment({
      rideId,
      customerId: req.user.id,
      method
    });

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
