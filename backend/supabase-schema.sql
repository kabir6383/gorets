-- ============================================================
-- Goret's Cafe — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- MENU TABLE
CREATE TABLE IF NOT EXISTS menu (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  category   TEXT NOT NULL,
  price      INTEGER NOT NULL,
  image      TEXT,
  tags       TEXT[] DEFAULT '{}'
);

-- Enable Read access for everyone (menu is public)
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public menu read" ON menu FOR SELECT USING (true);
CREATE POLICY "Service role full access on menu" ON menu USING (auth.role() = 'service_role');

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  customer_name    TEXT,
  customer_phone   TEXT,
  items            JSONB NOT NULL,
  subtotal         INTEGER NOT NULL,
  discount         INTEGER DEFAULT 0,
  delivery_fee     INTEGER DEFAULT 0,
  tax              INTEGER DEFAULT 0,
  total            INTEGER NOT NULL,
  promo_code       TEXT,
  payment_method   TEXT,
  dining_mode      TEXT,
  table_number     TEXT,
  status           TEXT DEFAULT 'placed',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on orders" ON orders USING (auth.role() = 'service_role');

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
