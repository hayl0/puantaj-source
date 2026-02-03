import Iyzipay from 'iyzipay';

export const iyzico = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'dummy_key',
  secretKey: process.env.IYZICO_SECRET_KEY || 'dummy_secret',
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});
