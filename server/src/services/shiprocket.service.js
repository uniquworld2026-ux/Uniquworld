const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

let cachedToken = null;
let tokenExpiresAt = 0;

const isConfigured = () =>
  Boolean(config.shiprocket.enabled && config.shiprocket.email && config.shiprocket.password);

const request = async (path, { method = 'GET', body, token } = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${config.shiprocket.baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    logger.error('Shiprocket API error', { path, status: res.status, data });
    throw ApiError.badRequest(data.message || 'Shiprocket request failed');
  }
  return data;
};

const getToken = async () => {
  if (!isConfigured()) {
    throw ApiError.badRequest('Shiprocket is not enabled or credentials are missing');
  }
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const data = await request('/auth/login', {
    method: 'POST',
    body: {
      email: config.shiprocket.email,
      password: config.shiprocket.password,
    },
  });

  cachedToken = data.token;
  tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000; // ~9 days
  return cachedToken;
};

const createAdhocOrder = async (payload) => {
  const token = await getToken();
  return request('/orders/create/adhoc', {
    method: 'POST',
    token,
    body: payload,
  });
};

const normalizeTracking = (data) => {
  const track = data?.tracking_data || data || {};
  const scans =
    track.shipment_track_activities ||
    track.track_activities ||
    track.shipment_track ||
    [];

  const activities = (Array.isArray(scans) ? scans : []).map((scan) => ({
    status:
      scan['sr-status-label'] ||
      scan.status ||
      scan.activity ||
      scan['status'] ||
      'Update',
    location: scan.location || scan.city || scan['location'] || '',
    timestamp: scan.date || scan['updated-time'] || scan.datetime || scan['date'] || null,
  }));

  return {
    awb: track.awb_code || data?.awb_code || null,
    courier: track.courier_name || data?.courier_name || null,
    status: track.shipment_status || track.current_status || track.status || null,
    etd: track.edd || track.etd || null,
    activities,
    raw: data,
  };
};

const trackByAwb = async (awb) => {
  const token = await getToken();
  const data = await request(`/courier/track/awb/${encodeURIComponent(awb)}`, { token });
  return normalizeTracking(data);
};

const cancelShipmentByAwb = async (awb) => {
  const token = await getToken();
  return request('/orders/cancel/shipment/awbs', {
    method: 'POST',
    token,
    body: { awbs: [String(awb)] },
  });
};

const cancelOrdersByIds = async (shiprocketOrderIds = []) => {
  const ids = shiprocketOrderIds.map((id) => Number(id)).filter(Boolean);
  if (!ids.length) throw ApiError.badRequest('Shiprocket order id is required to cancel');
  const token = await getToken();
  return request('/orders/cancel', {
    method: 'POST',
    token,
    body: { ids },
  });
};

const buildOrderPayload = (order) => {
  const addr = order.shippingAddress || {};
  const paymentMethod = order.payment?.method === 'cod' ? 'COD' : 'Prepaid';

  return {
    order_id: order.orderNumber,
    order_date: new Date(order.createdAt).toISOString().slice(0, 19).replace('T', ' '),
    pickup_location: config.shiprocket.pickupLocation || 'Primary',
    channel_id: config.shiprocket.channelId || undefined,
    billing_customer_name: addr.fullName || 'Customer',
    billing_last_name: '',
    billing_address: addr.line1 || '',
    billing_address_2: addr.line2 || '',
    billing_city: addr.city || '',
    billing_pincode: addr.postalCode || '',
    billing_state: addr.state || '',
    billing_country: addr.country || 'India',
    billing_email: order.userEmail || 'orders@uniquworld.com',
    billing_phone: addr.phone || '',
    shipping_is_billing: true,
    order_items: (order.items || []).map((item) => ({
      name: item.productName,
      sku: item.sku || item.id,
      units: item.quantity,
      selling_price: item.unitPrice,
    })),
    payment_method: paymentMethod,
    sub_total: order.subtotal,
    length: 20,
    breadth: 15,
    height: 10,
    weight: 0.5,
  };
};

/**
 * Create Shiprocket shipment for a paid/confirmed order.
 * Pickup is always config.shiprocket.pickupLocation (your office in Shiprocket dashboard).
 * Courier assignment and pickup scheduling are completed in Shiprocket after this API call.
 * When Shiprocket is disabled, returns a mock tracking stub for local/dev.
 */
const createShipmentForOrder = async (order) => {
  if (!isConfigured()) {
    return {
      mock: true,
      carrier: 'shiprocket',
      status: 'pending',
      awbCode: null,
      courierName: null,
      trackingUrl: `${config.clientUrl}/track-order?order=${order.orderNumber}`,
      shiprocketOrderId: null,
      shiprocketShipmentId: null,
      metadata: { reason: 'Shiprocket disabled — stub shipment' },
    };
  }

  const payload = buildOrderPayload(order);
  const data = await createAdhocOrder(payload);

  return {
    mock: false,
    carrier: 'shiprocket',
    status: 'created',
    awbCode: data.awb_code || null,
    courierName: data.courier_name || null,
    trackingUrl: data.awb_code
      ? `https://shiprocket.co/tracking/${data.awb_code}`
      : null,
    shiprocketOrderId: String(data.order_id || ''),
    shiprocketShipmentId: String(data.shipment_id || ''),
    labelUrl: data.label_url || null,
    metadata: data,
    shippedAt: new Date().toISOString(),
  };
};

module.exports = {
  isConfigured,
  createShipmentForOrder,
  trackByAwb,
  normalizeTracking,
  cancelShipmentByAwb,
  cancelOrdersByIds,
  getToken,
};
