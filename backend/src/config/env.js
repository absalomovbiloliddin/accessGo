import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  paymentReturnUrl: process.env.PAYMENT_RETURN_URL || 'https://accessgo.uz/payment/success',
  click: {
    serviceId: process.env.CLICK_SERVICE_ID,
    merchantId: process.env.CLICK_MERCHANT_ID,
    secretKey: process.env.CLICK_SECRET_KEY,
    baseUrl: process.env.CLICK_BASE_URL || 'https://api.click.uz/v2/merchant'
  },
  payme: {
    merchantId: process.env.PAYME_MERCHANT_ID,
    login: process.env.PAYME_LOGIN || 'Paycom',
    key: process.env.PAYME_KEY,
    baseUrl: process.env.PAYME_BASE_URL || 'https://checkout.paycom.uz/api'
  }
};

export default env;
