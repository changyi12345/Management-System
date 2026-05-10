const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, 'g001f.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      staffId TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      assignedCategory TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      barcode TEXT NOT NULL,
      expireDate TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      supportType TEXT NOT NULL,
      supportWeek TEXT,
      assignedStaffId TEXT NOT NULL,
      assignedStaffName TEXT NOT NULL,
      category TEXT NOT NULL,
      lifecycle TEXT NOT NULL,
      alertLevel TEXT NOT NULL,
      daysLeft INTEGER NOT NULL
    )
  `);

  db.run(`ALTER TABLE products ADD COLUMN supportWeek TEXT`, (err) => {
    // Ignore error if column already exists
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      productId TEXT,
      productName TEXT,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )
  `);

  const insertInitialUsers = db.prepare(`
    INSERT OR IGNORE INTO users (id, staffId, name, password, role, assignedCategory)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const initialUsers = [
    { id: '1', staffId: 'ADMIN001', name: 'Admin', password: 'admin123', role: 'Admin', assignedCategory: null },
    { id: '2', staffId: 'SFF001', name: 'Mg Mg', password: 'mgmg123', role: 'Staff', assignedCategory: 'Drinks' },
    { id: '3', staffId: 'SFF002', name: 'Su Su', password: 'susu123', role: 'Staff', assignedCategory: 'Snacks' },
    { id: '4', staffId: 'SFF003', name: 'Kyaw Kyaw', password: 'kyawkyaw123', role: 'Staff', assignedCategory: 'Frozen Food' }
  ];

  initialUsers.forEach(user => {
    insertInitialUsers.run(user.id, user.staffId, user.name, user.password, user.role, user.assignedCategory);
  });

  const insertInitialCategories = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name)
    VALUES (?, ?)
  `);

  const initialCategories = [
    { id: '1', name: 'Drinks' },
    { id: '2', name: 'Snacks' },
    { id: '3', name: 'Frozen Food' }
  ];

  initialCategories.forEach(category => {
    insertInitialCategories.run(category.id, category.name);
  });
});

app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', (err, users) => {
    if (err) return res.status(500).json(err);
    res.json(users);
  });
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  const id = Date.now().toString();
  db.run('INSERT INTO users (id, staffId, name, password, role, assignedCategory) VALUES (?, ?, ?, ?, ?, ?)',
    [id, user.staffId, user.name, user.password, user.role, user.assignedCategory],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ ...user, id });
    });
});

app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.put('/api/users/:id', (req, res) => {
  const user = req.body;
  db.run('UPDATE users SET staffId = ?, name = ?, password = ?, assignedCategory = ? WHERE id = ?',
    [user.staffId, user.name, user.password, user.assignedCategory, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json(user);
    });
});

app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) return res.status(500).json(err);
    res.json(products);
  });
});

app.post('/api/products', (req, res) => {
  const product = req.body;
  const id = Date.now().toString();
  db.run(`
    INSERT INTO products (id, name, barcode, expireDate, quantity, supportType, supportWeek, assignedStaffId, assignedStaffName, category, lifecycle, alertLevel, daysLeft)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, product.name, product.barcode, product.expireDate, product.quantity, product.supportType,
    product.supportWeek, product.assignedStaffId, product.assignedStaffName, product.category,
    product.lifecycle, product.alertLevel, product.daysLeft], function (err) {
      if (err) return res.status(500).json(err);
      res.json({ ...product, id });
    });
});

app.put('/api/products/:id', (req, res) => {
  const product = req.body;
  db.run(`
    UPDATE products
    SET name = ?, barcode = ?, expireDate = ?, quantity = ?, supportType = ?, supportWeek = ?,
        assignedStaffId = ?, assignedStaffName = ?, category = ?, lifecycle = ?, alertLevel = ?, daysLeft = ?
    WHERE id = ?
  `, [product.name, product.barcode, product.expireDate, product.quantity, product.supportType,
    product.supportWeek, product.assignedStaffId, product.assignedStaffName, product.category,
    product.lifecycle, product.alertLevel, product.daysLeft, req.params.id], function (err) {
      if (err) return res.status(500).json(err);
      res.json(product);
    });
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.get('/api/audit-logs', (req, res) => {
  db.all('SELECT * FROM audit_logs ORDER BY timestamp DESC', (err, logs) => {
    if (err) return res.status(500).json(err);
    res.json(logs);
  });
});

app.post('/api/audit-logs', (req, res) => {
  const log = req.body;
  const id = Date.now().toString();
  db.run(`
    INSERT INTO audit_logs (id, action, productId, productName, userId, userName, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [id, log.action, log.productId, log.productName, log.userId, log.userName, log.timestamp], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ ...log, id });
  });
});

app.post('/api/login', (req, res) => {
  const { staffId, password } = req.body;
  db.get('SELECT * FROM users WHERE staffId = ? AND password = ?', [staffId, password], (err, user) => {
    if (err) return res.status(500).json(err);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) return res.status(500).json(err);
    res.json(categories);
  });
});

app.post('/api/categories', (req, res) => {
  const category = req.body;
  const id = Date.now().toString();
  db.run('INSERT INTO categories (id, name) VALUES (?, ?)',
    [id, category.name],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ ...category, id });
    });
});

app.put('/api/categories/:id', (req, res) => {
  const category = req.body;
  db.run('UPDATE categories SET name = ? WHERE id = ?',
    [category.name, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json(category);
    });
});

app.delete('/api/categories/:id', (req, res) => {
  db.run('DELETE FROM categories WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
