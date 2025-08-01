import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          department: 'Faith' | 'Love' | 'Hope';
          baptism_status: 'baptized' | 'not-baptized' | 'scheduled';
          status: 'active' | 'inactive';
          join_date: string;
          birth_date: string;
          address: string;
          photo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email: string;
          department: 'Faith' | 'Love' | 'Hope';
          baptism_status: 'baptized' | 'not-baptized' | 'scheduled';
          status: 'active' | 'inactive';
          join_date: string;
          birth_date: string;
          address: string;
          photo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          department?: 'Faith' | 'Love' | 'Hope';
          baptism_status?: 'baptized' | 'not-baptized' | 'scheduled';
          status?: 'active' | 'inactive';
          join_date?: string;
          birth_date?: string;
          address?: string;
          photo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          member_id: string;
          service_date: string;
          service_type: 'sunday-encounter' | 'wednesday-miracle' | 'friday-prayer';
          present: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          service_date: string;
          service_type: 'sunday-encounter' | 'wednesday-miracle' | 'friday-prayer';
          present: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          service_date?: string;
          service_type?: 'sunday-encounter' | 'wednesday-miracle' | 'friday-prayer';
          present?: boolean;
          notes?: string | null;
          created_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          member_id: string;
          amount: number;
          category: 'tithe' | 'offering' | 'project' | 'special';
          date: string;
          method: 'cash' | 'check' | 'online' | 'transfer';
          notes: string | null;
          receipt_sent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          amount: number;
          category: 'tithe' | 'offering' | 'project' | 'special';
          date: string;
          method: 'cash' | 'check' | 'online' | 'transfer';
          notes?: string | null;
          receipt_sent?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          amount?: number;
          category?: 'tithe' | 'offering' | 'project' | 'special';
          date?: string;
          method?: 'cash' | 'check' | 'online' | 'transfer';
          notes?: string | null;
          receipt_sent?: boolean;
          created_at?: string;
        };
      };
      visitors: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          visit_date: string;
          invited_by: string | null;
          follow_up_status: 'pending' | 'contacted' | 'completed';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          visit_date: string;
          invited_by?: string | null;
          follow_up_status?: 'pending' | 'contacted' | 'completed';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          visit_date?: string;
          invited_by?: string | null;
          follow_up_status?: 'pending' | 'contacted' | 'completed';
          notes?: string | null;
          created_at?: string;
        };
      };
      equipment: {
        Row: {
          id: string;
          name: string;
          category: string;
          condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
          purchase_date: string;
          value: number;
          location: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
          purchase_date: string;
          value: number;
          location: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          condition?: 'excellent' | 'good' | 'fair' | 'needs-repair';
          purchase_date?: string;
          value?: number;
          location?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      message_templates: {
        Row: {
          id: string;
          name: string;
          subject: string;
          content: string;
          type: 'sms' | 'email';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subject: string;
          content: string;
          type: 'sms' | 'email';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subject?: string;
          content?: string;
          type?: 'sms' | 'email';
          created_at?: string;
        };
      };
    };
  };
} 