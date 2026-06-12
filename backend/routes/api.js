require('dotenv').config();
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { sendWhatsAppInvoice } = require('../utils/whatsapp');

// ── Supabase client ──────────────────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const useSupabase = supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT');
const supabase = useSupabase ? createClient(supabaseUrl, supabaseKey) : null;

if (useSupabase) {
  console.log('🟢 Using Supabase database');
} else {
  console.log('🟡 Supabase URL not set — falling back to local JSON store');
}

// ── JSON fallback helpers ────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]');

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return []; }
}
function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// ── GET /api/menu ────────────────────────────────────────────────────────────
router.get('/menu', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('menu')
        .select('*')
        .order('category', { ascending: true });
      if (error) throw error;
      return res.json(data);
    }
    res.json(readJSON(MENU_FILE));
  } catch (err) {
    console.error('GET /menu error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/menu/:id ────────────────────────────────────────────────────────
router.get('/menu/:id', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('menu')
        .select('*')
        .eq('id', req.params.id)
        .single();
      if (error) throw error;
      return res.json(data);
    }
    const item = readJSON(MENU_FILE).find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(404).json({ message: 'Item not found' });
  }
});

// ── POST /api/orders ─────────────────────────────────────────────────────────
router.post('/orders', async (req, res) => {
  try {
    const order = {
      ...req.body,
      id: req.body.id || `ORD-${Date.now()}-GP`,
      status: 'placed',
      created_at: new Date().toISOString(),
    };

    if (useSupabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();
      if (error) throw error;
      
      // Send invoice via WhatsApp
      sendWhatsAppInvoice(data);
      
      return res.status(201).json(data);
    }

    const orders = readJSON(ORDERS_FILE);
    orders.push(order);
    writeJSON(ORDERS_FILE, orders);
    
    // Send invoice via WhatsApp
    sendWhatsAppInvoice(order);
    
    res.status(201).json(order);
  } catch (err) {
    console.error('POST /orders error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// ── GET /api/orders ──────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.json(data);
    }
    res.json(readJSON(ORDERS_FILE).reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/orders/:id ───────────────────────────────────────────────────────
router.get('/orders/:id', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', req.params.id)
        .single();
      if (error) throw error;
      return res.json(data);
    }
    const order = readJSON(ORDERS_FILE).find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(404).json({ message: 'Order not found' });
  }
});

// ── PATCH /api/orders/:id/status ─────────────────────────────────────────────
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (useSupabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', req.params.id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    }
    const orders = readJSON(ORDERS_FILE);
    const idx = orders.findIndex(o => o.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Order not found' });
    orders[idx].status = status;
    writeJSON(ORDERS_FILE, orders);
    res.json(orders[idx]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
