import { supabase } from '../lib/supabase';

export const apiService = {
  async login(staffId: string, password: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('staff_id', staffId)
      .single();

    if (error || !data) {
      throw new Error('Invalid credentials');
    }

    if (data.password !== password) {
      throw new Error('Invalid credentials');
    }

    return {
      id: data.id,
      name: data.name,
      staffId: data.staff_id,
      role: data.role,
      assignedCategory: data.assigned_category
    };
  },

  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(user => ({
      id: user.id,
      name: user.name,
      staffId: user.staff_id,
      password: user.password,
      role: user.role,
      assignedCategory: user.assigned_category
    }));
  },

  async addUser(user: any) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        staff_id: user.staffId,
        password: user.password,
        role: user.role,
        assigned_category: user.assignedCategory
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      staffId: data.staff_id,
      password: data.password,
      role: data.role,
      assignedCategory: data.assigned_category
    };
  },

  async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async updateUser(user: any) {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: user.name,
        staff_id: user.staffId,
        password: user.password,
        role: user.role,
        assigned_category: user.assignedCategory
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      staffId: data.staff_id,
      password: data.password,
      role: data.role,
      assignedCategory: data.assigned_category
    };
  },

  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(product => ({
      id: product.id,
      name: product.name,
      barcode: product.barcode,
      expireDate: product.expire_date,
      quantity: product.quantity,
      supportType: product.support_type,
      supportWeek: product.support_week,
      assignedStaffId: product.assigned_staff_id,
      assignedStaffName: product.assigned_staff_name,
      category: product.category,
      daysLeft: product.days_left,
      lifecycle: product.lifecycle,
      alertLevel: product.alert_level
    }));
  },

  async addProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        barcode: product.barcode,
        expire_date: product.expireDate,
        quantity: product.quantity,
        support_type: product.supportType,
        support_week: product.supportWeek,
        assigned_staff_id: product.assignedStaffId,
        assigned_staff_name: product.assignedStaffName,
        category: product.category
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      barcode: data.barcode,
      expireDate: data.expire_date,
      quantity: data.quantity,
      supportType: data.support_type,
      supportWeek: data.support_week,
      assignedStaffId: data.assigned_staff_id,
      assignedStaffName: data.assigned_staff_name,
      category: data.category,
      daysLeft: data.days_left,
      lifecycle: data.lifecycle,
      alertLevel: data.alert_level
    };
  },

  async updateProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        barcode: product.barcode,
        expire_date: product.expireDate,
        quantity: product.quantity,
        support_type: product.supportType,
        support_week: product.supportWeek,
        assigned_staff_id: product.assignedStaffId,
        assigned_staff_name: product.assignedStaffName,
        category: product.category
      })
      .eq('id', product.id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      barcode: data.barcode,
      expireDate: data.expire_date,
      quantity: data.quantity,
      supportType: data.support_type,
      supportWeek: data.support_week,
      assignedStaffId: data.assigned_staff_id,
      assignedStaffName: data.assigned_staff_name,
      category: data.category,
      daysLeft: data.days_left,
      lifecycle: data.lifecycle,
      alertLevel: data.alert_level
    };
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async getAuditLogs() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(log => ({
      id: log.id,
      action: log.action,
      details: log.details,
      userId: log.user_id,
      userName: log.user_name,
      createdAt: log.created_at
    }));
  },

  async addAuditLog(log: any) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        action: log.action,
        details: log.details,
        user_id: log.userId,
        user_name: log.userName
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      action: data.action,
      details: data.details,
      userId: data.user_id,
      userName: data.user_name,
      createdAt: data.created_at
    };
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(category => ({
      id: category.id,
      name: category.name
    }));
  },

  async addCategory(category: any) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name
    };
  },

  async updateCategory(category: any) {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name
      })
      .eq('id', category.id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name
    };
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};
