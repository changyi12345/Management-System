import { supabase } from '../supabase';
import type { User, Product, AuditLog } from '../types';

export const supabaseService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.log('Users table not found yet (using mock data)');
      return [];
    }
    return data as User[];
  },

  async addUser(user: Omit<User, 'id'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select();
    
    if (error) {
      console.log('Users table not found yet');
      return null;
    }
    return data[0] as User;
  },

  async deleteUser(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.log('Users table not found yet');
      return false;
    }
    return true;
  },

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.log('Products table not found yet (using mock data)');
      return [];
    }
    return data as Product[];
  },

  async addProduct(product: Omit<Product, 'id' | 'lifecycle' | 'alertLevel' | 'daysLeft'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    
    if (error) {
      console.log('Products table not found yet');
      return null;
    }
    return data[0] as Product;
  },

  async updateProduct(product: Product): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', product.id)
      .select();
    
    if (error) {
      console.log('Products table not found yet');
      return null;
    }
    return data[0] as Product;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) {
      console.log('Products table not found yet');
      return false;
    }
    return true;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.log('Audit logs table not found yet');
      return [];
    }
    return data as AuditLog[];
  },

  async addAuditLog(log: Omit<AuditLog, 'id'>): Promise<AuditLog | null> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([log])
      .select();
    
    if (error) {
      console.log('Audit logs table not found yet');
      return null;
    }
    return data[0] as AuditLog;
  },

  async login(staffId: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('staffId', staffId)
      .eq('password', password);
    
    if (error || data.length === 0) {
      console.log('Users table not found or invalid credentials');
      return null;
    }
    return data[0] as User;
  }
};
