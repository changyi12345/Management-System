import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { User, Product, ProductLifecycle, AlertLevel, AuditLog } from './types';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Staff } from './pages/Staff';
import { Categories } from './pages/Categories';
import { Reports } from './pages/Reports';
import { Audit } from './pages/Audit';
import { Profile } from './pages/Profile';
import { apiService } from './services/apiService';

function calculateProductFields(expireDateStr: string): { lifecycle: ProductLifecycle, alertLevel: AlertLevel, daysLeft: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expire = new Date(expireDateStr);
  expire.setHours(0, 0, 0, 0);
  const diffTime = expire.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let lifecycle: ProductLifecycle = "Active";
  let alertLevel: AlertLevel = "Green";

  if (diffDays < 0) {
    lifecycle = "Expired";
    alertLevel = "Critical";
  } else if (diffDays <= 1) {
    lifecycle = "Return Due";
    alertLevel = "Red";
  } else if (diffDays <= 7) {
    lifecycle = "Return Due";
    alertLevel = "Orange";
  } else if (diffDays <= 14) {
    lifecycle = "Warning";
    alertLevel = "Yellow";
  } else if (diffDays <= 30) {
    lifecycle = "Warning";
    alertLevel = "Green";
  }

  return { lifecycle, alertLevel, daysLeft: diffDays };
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedUsers, fetchedProducts, fetchedLogs, fetchedCategories] = await Promise.all([
          apiService.getUsers(),
          apiService.getProducts(),
          apiService.getAuditLogs(),
          apiService.getCategories()
        ]);
        setUsers(fetchedUsers);
        setProducts(fetchedProducts);
        setAuditLogs(fetchedLogs);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const addAuditLog = useCallback(async (action: string, productId?: string, productName?: string) => {
    if (!currentUser) return;
    const log: AuditLog = {
      id: Date.now().toString(),
      action,
      productId,
      productName,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString()
    };
    try {
      const savedLog = await apiService.addAuditLog(log);
      setAuditLogs(prev => [savedLog, ...prev]);
    } catch (err) {
      console.error('Error adding audit log:', err);
    }
  }, [currentUser]);

  const handleLoginWithSave = useCallback(async (staffId: string, password: string) => {
    const user = await apiService.login(staffId, password);
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleAddProductLocally = useCallback(async (productData: Omit<Product, 'id' | 'lifecycle' | 'alertLevel' | 'daysLeft'>) => {
    const productFields = calculateProductFields(productData.expireDate);
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      ...productFields
    };

    try {
      const savedProduct = await apiService.addProduct(newProduct);
      setProducts(prev => [...prev, savedProduct]);
      await addAuditLog('Added product', savedProduct.id, savedProduct.name);
      return savedProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  }, [addAuditLog]);

  const handleUpdateProductLocally = useCallback(async (product: Product) => {
    const productFields = calculateProductFields(product.expireDate);
    const updatedProduct = { ...product, ...productFields };
    
    try {
      const savedProduct = await apiService.updateProduct(updatedProduct);
      setProducts(prev => prev.map(p => p.id === product.id ? savedProduct : p));
      await addAuditLog('Edited product', product.id, product.name);
      return savedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  }, [addAuditLog]);

  const handleDeleteProductLocally = useCallback(async (productId: string, productName: string) => {
    try {
      await apiService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      await addAuditLog('Deleted product', productId, productName);
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  }, [addAuditLog]);

  const handleAddUserLocally = useCallback(async (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };

    try {
      const savedUser = await apiService.addUser(newUser);
      setUsers(prev => [...prev, savedUser]);
      await addAuditLog(`Added staff: ${newUser.name}`);
      return savedUser;
    } catch (err) {
      console.error('Error adding user:', err);
      throw err;
    }
  }, [addAuditLog]);

  const handleDeleteUserLocally = useCallback(async (userId: string, userName: string) => {
    try {
      await apiService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      await addAuditLog(`Deleted staff: ${userName}`);
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  }, [addAuditLog]);

  const handleUpdateUserLocally = useCallback(async (user: User) => {
    try {
      const savedUser = await apiService.updateUser(user);
      setUsers(prev => prev.map(u => u.id === user.id ? savedUser : u));
      await addAuditLog(`Updated staff: ${user.name}`);
      return savedUser;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  }, [addAuditLog]);

  const handleUpdatePassword = useCallback(async (_currentPassword: string, newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const updatedUser = { ...currentUser, password: newPassword };
      const savedUser = await apiService.updateUser(updatedUser);
      setCurrentUser(savedUser);
      localStorage.setItem('currentUser', JSON.stringify(savedUser));
      await addAuditLog('Changed password');
    } catch (err) {
      console.error('Error updating password:', err);
      throw err;
    }
  }, [currentUser, addAuditLog]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      {!currentUser ? (
        <Routes>
          <Route path="/login" element={
            <Login 
              onLogin={handleLoginWithSave} 
              users={users} 
            />
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="app-layout">
          <Sidebar currentUser={currentUser} onLogout={handleLogout} products={products} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  currentUser={currentUser} 
                  onLogout={handleLogout}
                  products={products}
                  users={users}
                />
              } />
              <Route path="/products" element={
                <Products 
                  currentUser={currentUser} 
                  products={products} 
                  categories={categories}
                  onAddProduct={handleAddProductLocally}
                  onUpdateProduct={handleUpdateProductLocally}
                  onDeleteProduct={handleDeleteProductLocally}
                />
              } />
              <Route path="/staff" element={
                currentUser.role === 'Admin' ? (
                  <Staff 
                    users={users} 
                    categories={categories}
                    onAddUser={handleAddUserLocally}
                    onDeleteUser={handleDeleteUserLocally}
                    onUpdateUser={handleUpdateUserLocally}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } />
              <Route path="/categories" element={
                currentUser.role === 'Admin' ? (
                  <Categories />
                ) : (
                  <Navigate to="/" replace />
                )
              } />
              <Route path="/reports" element={
                currentUser.role === 'Admin' ? (
                  <Reports 
                    currentUser={currentUser} 
                    products={products} 
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } />
              <Route path="/audit" element={
                currentUser.role === 'Admin' ? (
                  <Audit 
                    currentUser={currentUser} 
                    auditLogs={auditLogs} 
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } />
              <Route path="/profile" element={
                <Profile currentUser={currentUser} onUpdatePassword={handleUpdatePassword} />
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
