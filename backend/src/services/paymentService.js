import { v4 as uuidv4 } from 'uuid';
import pool from '../db/pool.js';
import { createClickInvoice } from './clickService.js';
import { createPaymeInvoice } from './paymeService.js';

async function initiatePayment({ rideId, customerId, method }) {
  const rideResult = await pool.query(
    `SELECT r.id, r.fare_uzs, u.phone
     FROM rides r
     JOIN users u ON u.id = r.customer_id
     WHERE r.id = $1 AND r.customer_id = $2`,
    [rideId, customerId]
  );

  if (!rideResult.rows.length) {
    throw new Error('Ride topilmadi');
  }

  const ride = rideResult.rows[0];
  const paymentId = uuidv4();

  let providerInvoiceId = null;
  let checkoutUrl = null;
  let providerPayload = {};

  if (method === 'click') {
    const clickInvoice = await createClickInvoice({
      paymentId,
      amountUzs: ride.fare_uzs,
      phone: ride.phone
    });

    providerInvoiceId = clickInvoice.invoiceId;
    checkoutUrl = clickInvoice.checkoutUrl;
    providerPayload = clickInvoice.raw;
  }

  if (method === 'payme') {
    const paymeInvoice = await createPaymeInvoice({
      paymentId,
      amountUzs: ride.fare_uzs,
      phone: ride.phone
    });

    providerInvoiceId = paymeInvoice.invoiceId;
    checkoutUrl = paymeInvoice.checkoutUrl;
    providerPayload = paymeInvoice.raw;
  }

  if (method === 'cash') {
    providerInvoiceId = paymentId;
    checkoutUrl = null;
    providerPayload = { type: 'cash' };
  }

  const status = method === 'cash' ? 'paid' : 'pending';
  const paidAt = method === 'cash' ? new Date() : null;

  const paymentResult = await pool.query(
    `INSERT INTO payments (id, ride_id, customer_id, method, amount_uzs, provider_invoice_id, provider_payload, status, paid_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, method, amount_uzs, provider_invoice_id, status, paid_at, created_at`,
    [
      paymentId,
      rideId,
      customerId,
      method,
      ride.fare_uzs,
      providerInvoiceId,
      providerPayload,
      status,
      paidAt
    ]
  );

  return {
    payment: paymentResult.rows[0],
    checkoutUrl
  };
}

export { initiatePayment };
