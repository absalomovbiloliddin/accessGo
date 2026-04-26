import crypto from 'crypto';
import axios from 'axios';
import env from '../config/env.js';

async function createClickInvoice({ paymentId, amountUzs, phone }) {
  if (!env.click.serviceId || !env.click.merchantId || !env.click.secretKey) {
    throw new Error("Click konfiguratsiyasi to'liq emas");
  }

  const timestamp = Date.now();
  const signInput = `${timestamp}${env.click.secretKey}${paymentId}${amountUzs}`;
  const sign = crypto.createHash('sha1').update(signInput).digest('hex');

  const payload = {
    service_id: env.click.serviceId,
    merchant_id: env.click.merchantId,
    amount: amountUzs,
    transaction_param: paymentId,
    phone_number: phone,
    sign_time: timestamp,
    sign_string: sign,
    return_url: 'https://accessgo.uz/payment/success'
  };

  const response = await axios.post(`${env.click.baseUrl}/invoice/create`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.data || response.data.error) {
    throw new Error(response.data?.error_note || 'Click invoice yaratilmadi');
  }

  return {
    invoiceId: response.data.invoice_id || paymentId,
    checkoutUrl: response.data.invoice_url,
    raw: response.data
  };
}

export { createClickInvoice };
