
import type { CartItem } from './types';
import fetch from 'node-fetch';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_ENVIRONMENT } = process.env;
const base = PAYPAL_API_ENVIRONMENT === 'SANDBOX' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
async function generateAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("MISSING_API_CREDENTIALS: Your PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set in the .env file.");
  }
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data: any = await response.json();
  return data.access_token;
}

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export async function createPayPalOrder(cartItems: CartItem[]) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;

  // Calculate item_total by summing up the price of each item * quantity
  const itemTotalValue = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const shippingCost = 5.00;

  // Calculate grandTotal from the already calculated itemTotal and shipping
  // This avoids floating point inaccuracies.
  const grandTotal = itemTotalValue + shippingCost;
  
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: grandTotal.toFixed(2), // Use the consistent grand total
          breakdown: {
              item_total: {
                  currency_code: "USD",
                  value: itemTotalValue.toFixed(2),
              },
              shipping: {
                  currency_code: "USD",
                  value: shippingCost.toFixed(2),
              }
          }
        },
        items: cartItems.map(item => ({
            name: item.product.name,
            quantity: item.quantity.toString(),
            unit_amount: {
                currency_code: "USD",
                value: item.product.price.toFixed(2),
            },
            // category: 'PHYSICAL_GOODS' // Recommended for physical products
        }))
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export async function capturePayPalOrder(orderID: string) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

async function handleResponse(response: any) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
      ...jsonResponse
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
