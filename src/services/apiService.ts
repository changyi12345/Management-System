const API_BASE_URL = 'http://localhost:3001/api';

export const apiService = {
  async login(staffId: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`);
    return res.json();
  },

  async addUser(user: any) {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return res.json();
  },

  async deleteUser(id: string) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async updateUser(user: any) {
    const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return res.json();
  },

  async getProducts() {
    const res = await fetch(`${API_BASE_URL}/products`);
    return res.json();
  },

  async addProduct(product: any) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return res.json();
  },

  async updateProduct(product: any) {
    const res = await fetch(`${API_BASE_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return res.json();
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE_URL}/audit-logs`);
    return res.json();
  },

  async addAuditLog(log: any) {
    const res = await fetch(`${API_BASE_URL}/audit-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return res.json();
  },

  async addCategory(category: any) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return res.json();
  },

  async updateCategory(category: any) {
    const res = await fetch(`${API_BASE_URL}/categories/${category.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return res.json();
  },

  async deleteCategory(id: string) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
