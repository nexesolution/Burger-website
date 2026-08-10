const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const fs = require('fs');
const path = require('path');
const initialDbData = require('./initialDbData');

const app = express();
const PORT = process.env.PORT || 5050;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Initialize DB file if not exists
let dbState = { ...initialDbData };

if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    dbState = { ...initialDbData, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading db.json, using initialDbData', err);
  }
} else {
  fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf8');
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to db.json', err);
  }
};

// HTTP + WebSocket Server Setup
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Broadcast payload to all connected clients
const broadcastStateUpdate = (actionType, payload) => {
  const message = JSON.stringify({ type: 'SYNC_UPDATE', actionType, payload, timestamp: Date.now() });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

wss.on('connection', (ws) => {
  console.log('⚡ New client connected to WebSocket Realtime Engine');
  // Send current full state on connect
  ws.send(JSON.stringify({ type: 'INIT_STATE', payload: dbState }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'CLIENT_STATE_UPDATE') {
        dbState = { ...dbState, ...data.payload };
        saveDb();
        broadcastStateUpdate('FULL_SYNC', data.payload);
      }
    } catch (err) {
      console.error('Error parsing WebSocket message', err);
    }
  });
});

// REST API Endpoints

// 1. Get full state
app.get('/api/state', (req, res) => {
  res.json({ success: true, data: dbState });
});

// 2. Full State Sync / Save
app.post('/api/sync', (req, res) => {
  const newPayload = req.body;
  dbState = { ...dbState, ...newPayload };
  saveDb();
  broadcastStateUpdate('FULL_SYNC', newPayload);
  res.json({ success: true, message: 'Updated and broadcasted to all connected devices!' });
});

// 3. Products Endpoints
app.get('/api/products', (req, res) => res.json(dbState.products));
app.post('/api/products', (req, res) => {
  const newProd = { ...req.body, id: req.body.id || `prod-${Date.now()}` };
  dbState.products.unshift(newProd);
  saveDb();
  broadcastStateUpdate('ADD_PRODUCT', newProd);
  res.json({ success: true, data: newProd });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  dbState.products = dbState.products.map((p) => (p.id === id ? { ...p, ...req.body } : p));
  saveDb();
  broadcastStateUpdate('UPDATE_PRODUCT', { id, ...req.body });
  res.json({ success: true });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  dbState.products = dbState.products.filter((p) => p.id !== id);
  saveDb();
  broadcastStateUpdate('DELETE_PRODUCT', id);
  res.json({ success: true });
});

// 4. Orders Endpoints
app.get('/api/orders', (req, res) => res.json(dbState.orders));
app.post('/api/orders', (req, res) => {
  const newOrder = {
    ...req.body,
    id: req.body.id || `ord-${Date.now()}`,
    createdAt: req.body.createdAt || new Date().toISOString()
  };
  dbState.orders.unshift(newOrder);

  // If waiter assigned, credit waiter total sales automatically
  if (newOrder.waiterId) {
    dbState.waiters = dbState.waiters.map((w) =>
      w.id === newOrder.waiterId ? { ...w, totalSales: (w.totalSales || 0) + newOrder.total } : w
    );
  }

  saveDb();
  broadcastStateUpdate('ADD_ORDER', newOrder);
  res.json({ success: true, data: newOrder });
});

app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  dbState.orders = dbState.orders.map((o) => (o.id === id ? { ...o, ...req.body } : o));
  saveDb();
  broadcastStateUpdate('UPDATE_ORDER', { id, ...req.body });
  res.json({ success: true });
});

// 5. Waiters Endpoints
app.get('/api/waiters', (req, res) => res.json(dbState.waiters));
app.post('/api/waiters', (req, res) => {
  const newWaiter = { ...req.body, id: req.body.id || `w-${Date.now()}` };
  dbState.waiters.push(newWaiter);
  saveDb();
  broadcastStateUpdate('ADD_WAITER', newWaiter);
  res.json({ success: true, data: newWaiter });
});

app.post('/api/waiters/:id/sale', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  dbState.waiters = dbState.waiters.map((w) =>
    w.id === id ? { ...w, totalSales: (w.totalSales || 0) + parseFloat(amount) } : w
  );
  saveDb();
  broadcastStateUpdate('RECORD_WAITER_SALE', { id, amount });
  res.json({ success: true });
});

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    restaurant: dbState.storeSettings.restaurantName,
    message: 'BUZZ BURGER Full-Stack Backend API & WebSocket Realtime Server'
  });
});

server.listen(PORT, () => {
  console.log(`🚀 BUZZ BURGER Backend Server running on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Server active on ws://localhost:${PORT}`);
});
