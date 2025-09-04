
'use server';

import type { Recipient, OrderItem } from './types';

const PRINTFUL_API_URL = 'https://api.printful.com';

/**
 * Creates a new draft order in Printful.
 * @see https://www.printful.com/docs/orders#actionCreateaNewOrder
 * @param recipient - The recipient's shipping information.
 * @param items - The list of items in the order.
 * @returns The result from the Printful API.
 */
export async function createDraftOrder(recipient: Recipient, items: OrderItem[]) {
  const apiKey = process.env.PRINTFUL_API_KEY;

  if (!apiKey) {
    throw new Error('Printful API key is not configured. Please set PRINTFUL_API_KEY in your .env file.');
  }

  const payload = {
    recipient,
    items,
  };

  const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error('Printful API Error:', errorBody);
    throw new Error(`Printful API request failed: ${errorBody.result || response.statusText}`);
  }

  return await response.json();
}
