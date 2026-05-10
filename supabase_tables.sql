-- ============================================
-- Create all tables for G&G G0018F Expire Management System
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  staff_id TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Staff')) DEFAULT 'Staff',
  assigned_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Categories Table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Products Table
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  barcode TEXT NOT NULL,
  expire_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  support_type TEXT NOT NULL CHECK (support_type IN ('Return', 'Non-Support')) DEFAULT 'Return',
  support_week TEXT CHECK (support_week IN ('1 week', '2 weeks', '3 weeks', '1 month')),
  assigned_staff_id TEXT NOT NULL,
  assigned_staff_name TEXT NOT NULL,
  category TEXT NOT NULL,
  days_left INTEGER,
  lifecycle TEXT,
  alert_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Audit Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create RLS Policies (Allow all for simplicity)
-- ============================================
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on categories" ON categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on products" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on audit_logs" ON audit_logs
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Insert Default Categories
-- ============================================
INSERT INTO categories (name) VALUES
  ('Drinks'),
  ('Frozen Food'),
  ('Snacks'),
  ('Canned Food')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Insert Default Users
-- ============================================
INSERT INTO users (name, staff_id, password, role, assigned_category) VALUES
  ('Admin', 'ADMIN001', 'admin123', 'Admin', NULL),
  ('Mg Mg', 'SFF001', 'mgmg123', 'Staff', 'Drinks'),
  ('Su Su', 'SFF002', 'susu123', 'Staff', 'Frozen Food'),
  ('Kyaw Kyaw', 'SFF003', 'kyawkyaw123', 'Staff', 'Snacks')
ON CONFLICT (staff_id) DO NOTHING;
