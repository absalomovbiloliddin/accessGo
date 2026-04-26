import axios from 'axios';
import env from '../config/env.js';

async function createPaymeInvoice({ paymentId, amountUzs, phone }) {
  if (!env.payme.merchantId || !env.payme.key) {
    throw new Error("Payme konfiguratsiyasi to'liq emas");
  }

  const basic = Buffer.from(`${env.payme.login}:${env.payme.key}`).toString('base64');

  const response = await axios.post(
    env.payme.baseUrl,
    {
      id: paymentId,
      method: 'receipts.create',
      params: {
        amount: amountUzs * 100,
        account: {
          order_id: paymentId,
          phone
        }
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basic}`,
        'X-Auth': `${env.payme.login}:${env.payme.key}`
      }
    }
  );

  if (response.data?.error) {
    throw new Error(response.data.error.message || 'Payme chek yaratilmadi');
  }

  const receiptId = response.data?.result?.receipt?._id;
  const checkoutUrl = receiptId
    ? `https://checkout.paycom.uz/${receiptId}`
    : `https://checkout.paycom.uz/${env.payme.merchantId}?ac.order_id=${paymentId}`;

  return {
    invoiceId: receiptId || paymentId,
    checkoutUrl,
    raw: response.data
  };
}

export { createPaymeInvoice };
