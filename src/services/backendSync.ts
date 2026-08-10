import { useBuzzStore } from '../store/useBuzzStore';

const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5050';
};

const getWsUrl = () => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.hostname}:5050`;
};

let ws: WebSocket | null = null;
let isSyncingRemote = false;

export const initBackendSync = () => {
  const apiUrl = getApiUrl();
  const wsUrl = getWsUrl();

  // 1. Initial REST API Fetch from Backend
  fetch(`${apiUrl}/api/state`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.data) {
        console.log('✅ Loaded backend state from Server API:', data.data);
        isSyncingRemote = true;
        useBuzzStore.setState(data.data);
        isSyncingRemote = false;
      }
    })
    .catch((err) => {
      console.warn('⚠️ Could not connect to backend REST server. Running in offline/localStorage mode.', err);
    });

  // 2. Setup WebSocket connection for Realtime Live Sync across all devices
  try {
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('⚡ Connected to CHEESE O CHEESE Realtime WebSocket Backend Engine');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'INIT_STATE' || message.type === 'SYNC_UPDATE') {
          console.log('🔄 Realtime Sync Update Received from Server:', message.actionType);
          isSyncingRemote = true;
          if (message.type === 'INIT_STATE') {
            useBuzzStore.setState(message.payload);
          } else if (message.type === 'SYNC_UPDATE' && message.payload) {
            useBuzzStore.setState(message.payload);
          }
          isSyncingRemote = false;
        }
      } catch (e) {
        console.error('Error handling WebSocket message', e);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket closed. Retrying in 5 seconds...');
      setTimeout(initBackendSync, 5000);
    };

    ws.onerror = (err) => {
      console.warn('WebSocket connection error:', err);
    };
  } catch (err) {
    console.warn('Could not initialize WebSocket', err);
  }

  // 3. Subscribe to local Zustand changes to sync to Backend Server
  useBuzzStore.subscribe((state) => {
    if (isSyncingRemote) return;

    // Send payload to backend API
    const payload = {
      products: state.products,
      categories: state.categories,
      deals: state.deals,
      discountedItems: state.discountedItems,
      coupons: state.coupons,
      orders: state.orders,
      customers: state.customers,
      staff: state.staff,
      waiters: state.waiters,
      riders: state.riders,
      inventory: state.inventory,
      expenses: state.expenses,
      storeSettings: state.storeSettings
    };

    fetch(`${apiUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch((err) => {
      // Offline fallback
    });

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'CLIENT_STATE_UPDATE', payload }));
    }
  });
};
