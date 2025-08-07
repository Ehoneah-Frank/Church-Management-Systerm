import { supabase } from '../lib/supabase';
import { Role, UserRole } from '../types';

export const authService = {
  // Get user roles - simplified version
  async getUserRoles(userId: string): Promise<Role[]> {
    console.log('authService: Getting roles for user:', userId);
    
    try {
      // Use a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000);
      });

      const queryPromise = supabase
        .from('user_roles')
        .select(`
          role_id,
          roles (
            id,
            name,
            description,
            permissions
          )
        `)
        .eq('user_id', userId);

      const result = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      console.log('authService: Query completed:', result);

      if (result.error) {
        console.error('authService: Query error:', result.error);
        throw result.error;
      }
      
      const roles = result.data?.map((item: any) => item.roles).filter(Boolean) || [];
      console.log('authService: Processed roles:', roles);
      return roles;
    } catch (error) {
      console.error('authService: Exception in getUserRoles:', error);
      
      // Return empty array instead of throwing to prevent app from hanging
      return [];
    }
  },

  // Check if user has permission
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    
    // Super admin has all permissions
    if (roles.some(role => role.name === 'super_admin')) {
      return true;
    }

    // Check specific permissions
    return roles.some(role => {
      const permissions = role.permissions;
      return permissions[permission] === true || permissions[permission] === 'view';
    });
  },

  // Create new user with role
  async createUser(email: string, password: string, roleName: string): Promise<any> {
    // First create the user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;

    // Get the role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .single();

    if (roleError) throw roleError;

    // Assign role to user
    const { error: userRoleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role_id: roleData.id
      });

    if (userRoleError) throw userRoleError;

    return authData.user;
  },

  // Update user role
  async updateUserRole(userId: string, roleName: string): Promise<void> {
    // Get the role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .single();

    if (roleError) throw roleError;

    // Remove existing roles
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    // Add new role
    const { error: userRoleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleData.id
      });

    if (userRoleError) throw userRoleError;
  }
}; 