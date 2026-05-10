-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staffId TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Staff')),
  assignedCategory TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  barcode TEXT NOT NULL,
  expireDate TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  supportType TEXT NOT NULL CHECK (supportType IN ('Return', 'Non-Support')),
  assignedStaffId TEXT NOT NULL,
  assignedStaffName TEXT NOT NULL,
  category TEXT NOT NULL,
  lifecycle TEXT NOT NULL DEFAULT 'Active',
  alertLevel TEXT NOT NULL DEFAULT 'Green',
  daysLeft INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  productId TEXT,
  productName TEXT,
  userId TEXT NOT NULL,
  userName TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Insert initial admin user
INSERT INTO users (staffId, name, password, role)
VALUES ('ADMIN001', 'Admin', 'admin123', 'Admin')
ON CONFLICT (staffId) DO NOTHING;

-- Insert initial staff users
INSERT INTO users (staffId, name, password, role, assignedCategory)
VALUES 
  ('SFF001', 'Mg Mg', 'mgmg123', 'Staff', 'Drinks'),
  ('SFF002', 'Su Su', 'susu123', 'Staff', 'Snacks'),
  ('SFF003', 'Kyaw Kyaw', 'kyawkyaw123', 'Staff', 'Frozen Food')
ON CONFLICT (staffId) DO NOTHING;
