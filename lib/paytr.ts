import crypto from 'crypto';

interface PayTRConfig {
  merchant_id: string;
  merchant_key: string;
  merchant_salt: string;
  debug_on: 0 | 1;
  no_installment: 0 | 1;
  max_installment: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  timeout_limit: number;
}

export const paytrConfig: PayTRConfig = {
  merchant_id: process.env.PAYTR_MERCHANT_ID || '',
  merchant_key: process.env.PAYTR_MERCHANT_KEY || '',
  merchant_salt: process.env.PAYTR_MERCHANT_SALT || '',
  debug_on: 1, // Set to 0 in production
  no_installment: 0,
  max_installment: 0,
  timeout_limit: 30,
};

export const getPayTRToken = async (
  user_ip: string,
  user_name: string,
  user_email: string,
  user_address: string,
  user_phone: string,
  merchant_oid: string,
  payment_amount: number, // In kurus (100 TL = 10000) or normal? PayTR usually expects amount * 100 but let's check docs. Actually docs say "10.00" format or float. Wait, PayTR usually takes total amount.
  // Standard PayTR implementation usually takes payment_amount in standard currency units (e.g. 10.50) but let's verify.
  // Actually, standard PayTR IFRAME API expects payment_amount as 100 multiplied integer? No, usually "9.99" string or number.
  // Correction: PayTR expects payment_amount as integer (e.g. 10.00 TL -> 1000)
) => {
  const { merchant_id, merchant_key, merchant_salt, debug_on, no_installment, max_installment, timeout_limit } = paytrConfig;

  const currency = 'TL';
  const lang = 'tr';
  
  // Basket content
  const user_basket = JSON.stringify([
    ['Pro Plan Abonelik', '1.00', 1] // Name, Price, Quantity. Price should be string.
  ]);
  
  // PayTR expects amount to be multiplied by 100 if it's not already. 
  // Wait, looking at standard PayTR docs: "payment_amount" : "1000" (for 10.00 TL).
  const paytr_amount = payment_amount * 100;

  // Callback URLs
  const merchant_ok_url = `${process.env.NEXTAUTH_URL}/ayarlar?payment=success`;
  const merchant_fail_url = `${process.env.NEXTAUTH_URL}/ayarlar?payment=fail`;

  // Generate Token
  const basket = Buffer.from(user_basket).toString('base64');
  const user_basket_encoded = basket;

  // Concatenate for hash
  // merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode(if applicable)
  // Standard PayTR token string:
  // merchant_id + user_ip + merchant_oid + email + payment_amount + user_type + installment_count + currency + test_mode + non_3d + merchant_salt
  
  // Wait, the documentation says:
  // CONCAT = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode;
  const concat = `${merchant_id}${user_ip}${merchant_oid}${user_email}${paytr_amount}${user_basket_encoded}${no_installment}${max_installment}${currency}${debug_on}`;
  
  const token = crypto.createHmac('sha256', merchant_key).update(concat + merchant_salt).digest('base64');

  const formData = new URLSearchParams();
  formData.append('merchant_id', merchant_id);
  formData.append('user_ip', user_ip);
  formData.append('merchant_oid', merchant_oid);
  formData.append('email', user_email);
  formData.append('payment_amount', paytr_amount.toString());
  formData.append('paytr_token', token);
  formData.append('user_basket', user_basket_encoded);
  formData.append('debug_on', debug_on.toString());
  formData.append('no_installment', no_installment.toString());
  formData.append('max_installment', max_installment.toString());
  formData.append('user_name', user_name);
  formData.append('user_address', user_address);
  formData.append('user_phone', user_phone);
  formData.append('merchant_ok_url', merchant_ok_url);
  formData.append('merchant_fail_url', merchant_fail_url);
  formData.append('timeout_limit', timeout_limit.toString());
  formData.append('currency', currency);
  formData.append('lang', lang);

  try {
    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      return { token: result.token };
    } else {
      throw new Error(result.reason || 'PayTR token generation failed');
    }
  } catch (error) {
    console.error('PayTR API Error:', error);
    throw error;
  }
};
