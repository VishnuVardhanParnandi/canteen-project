const BASE = "http://127.0.0.1:8000/api";

export const fetchMenu = () =>
  fetch(`${BASE}/menu/`).then(res => res.json());

export const placeOrder = (data) =>
  fetch(`${BASE}/orders/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const fetchOrders = () =>
  fetch(`${BASE}/orders/`).then(res => res.json());

export const updateOrderStatus = (id, status) =>
  fetch(`${BASE}/orders/${id}/status/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

export const fetchReports = () =>
  fetch(`${BASE}/reports/`).then(res => res.json());
