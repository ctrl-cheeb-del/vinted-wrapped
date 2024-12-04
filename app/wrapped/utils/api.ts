import axios from 'axios';

const BACKEND_URL = 'https://vinted-wrapped-backend.vercel.app';

export async function fetchAllData(accessToken: string, xcsrfToken: string, domain: string) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'X-CSRF-Token': xcsrfToken,
    'X-Domain': domain,
  };

  const ordersResponse = await axios.get(`${BACKEND_URL}/api/my-orders`, { headers });
  
  const conversationsResponse = await axios.get(`${BACKEND_URL}/api/conversations`, { headers });
  
  const purchasesResponse = await axios.get(`${BACKEND_URL}/api/purchases`, { headers });

  return {
    orders: ordersResponse.data.my_orders,
    conversations: conversationsResponse.data.conversations,
    purchases: purchasesResponse.data.purchases
  };
} 