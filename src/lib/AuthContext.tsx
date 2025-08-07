import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { authService } from '../services/authService';
import { Role } from '../types';

interface AuthContextType {
  user: User | null;
  roles: Role[];
  loading: boolean;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Session error:', error);
          if (mounted) {
            setUser(null);
            setRoles([]);
            setLoading(false);
          }
          return;
        }

        console.log('AuthProvider: Session check complete', { 
          hasUser: !!session?.user, 
          userId: session?.user?.id 
        });

        if (session?.user && mounted) {
          setUser(session.user);
          try {
            console.log('AuthProvider: Loading user roles for:', session.user.id);
            
            // Add timeout for role loading
            const rolePromise = authService.getUserRoles(session.user.id);
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Role loading timeout')), 10000);
            });

            const userRoles = await Promise.race([rolePromise, timeoutPromise]) as Role[];
            console.log('AuthProvider: User roles loaded:', userRoles);
            
            if (mounted) {
              setRoles(userRoles);
            }
          } catch (roleError) {
            console.error('AuthProvider: Error loading user roles:', roleError);
            // Set default role if roles fail to load
            if (mounted) {
              setRoles([{
                id: 'default',
                name: 'user',
                description: 'Default user role',
                permissions: { dashboard: 'view', members: 'view', attendance: 'view' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }]);
            }
          }
        } else if (mounted) {
          setUser(null);
          setRoles([]);
        }
      } catch (error) {
        console.error('AuthProvider: Error initializing:', error);
        if (mounted) {
          setUser(null);
          setRoles([]);
        }
      } finally {
        if (mounted) {
          console.log('AuthProvider: Setting loading to false');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state change:', event, { 
          hasUser: !!session?.user, 
          userId: session?.user?.id 
        });
        
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          try {
            const userRoles = await authService.getUserRoles(session.user.id);
            if (mounted) {
              setRoles(userRoles);
            }
          } catch (roleError) {
            console.error('AuthProvider: Error loading user roles on auth change:', roleError);
            if (mounted) {
              setRoles([{
                id: 'default',
                name: 'user',
                description: 'Default user role',
                permissions: { dashboard: 'view', members: 'view', attendance: 'view' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }]);
            }
          }
        } else {
          setUser(null);
          setRoles([]);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('AuthProvider: Starting sign out process...');
      
      // Clear local state first
      setUser(null);
      setRoles([]);
      
      // Call Supabase signOut with proper options
      const { error } = await supabase.auth.signOut({
        scope: 'global' // This ensures the session is cleared everywhere
      });
      
      if (error) {
        console.error('AuthProvider: Supabase sign out error:', error);
        throw error;
      }
      
      // Clear all browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cached data
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      console.log('AuthProvider: Sign out successful');
    } catch (error) {
      console.error('AuthProvider: Sign out error:', error);
      // Even if there's an error, clear the local state and storage
      setUser(null);
      setRoles([]);
      localStorage.clear();
      sessionStorage.clear();
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    // Super admin has all permissions
    if (roles.some(role => role.name === 'super_admin')) {
      return true;
    }

    // Check specific permissions
    return roles.some(role => {
      const permissions = role.permissions;
      return permissions[permission] === true || permissions[permission] === 'view';
    });
  };

  const isSuperAdmin = roles.some(role => role.name === 'super_admin');
  const isAdmin = roles.some(role => role.name === 'admin');

  const value = {
    user,
    roles,
    loading,
    signOut,
    hasPermission,
    isSuperAdmin,
    isAdmin
  };

  console.log('AuthProvider: Current state:', { 
    user: user?.email, 
    roles: roles.map(r => r.name), 
    loading, 
    isSuperAdmin, 
    isAdmin 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 