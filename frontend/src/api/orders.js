const BASE_URL = "http://127.0.0.1:8000/api";

/* Create a new order (User places order) */
export const createOrder = async (orderData) => {
  const response = await fetch(`${BASE_URL}/orders/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error("Failed to place order");
  }

  return response.json();
};

/* Get all orders (Admin view) */
export const fetchOrders = async () => {
  const response = await fetch(`${BASE_URL}/orders/`);

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
};

/* Update order status (Admin updates status) */
export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(
    `${BASE_URL}/orders/${orderId}/status/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update order status");
  }

  return response.json();
};
