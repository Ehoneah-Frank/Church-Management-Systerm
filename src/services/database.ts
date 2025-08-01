import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import type { Member, AttendanceRecord, Donation, Visitor, Equipment, MessageTemplate } from '../types';

type Tables = Database['public']['Tables'];

// Helper function to convert database format to app format
const convertMemberFromDB = (dbMember: Tables['members']['Row']): Member => ({
  id: dbMember.id,
  memberNumber: dbMember.member_number || 0,
  name: dbMember.name,
  phone: dbMember.phone,
  email: dbMember.email,
  department: dbMember.department,
  baptismStatus: dbMember.baptism_status,
  status: dbMember.status,
  joinDate: dbMember.join_date,
  birthDate: dbMember.birth_date,
  address: dbMember.address,
  photo: dbMember.photo || '',
  attendanceHistory: [] // Will be loaded separately
});

const convertMemberToDB = (member: Omit<Member, 'id' | 'attendanceHistory'>): Tables['members']['Insert'] => ({
  member_number: member.memberNumber,
  name: member.name,
  phone: member.phone,
  email: member.email,
  department: member.department,
  baptism_status: member.baptismStatus,
  status: member.status,
  join_date: member.joinDate,
  birth_date: member.birthDate,
  address: member.address,
  photo: member.photo || null
});

// Members
export const membersService = {
  async getAll(): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
      throw error;
    }

    return data.map(convertMemberFromDB);
  },

  async create(member: Omit<Member, 'id' | 'attendanceHistory'>): Promise<Member> {
    const dbData = convertMemberToDB(member);
    console.log('Converting member data for database:', dbData);
    
    const { data, error } = await supabase
      .from('members')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating member:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Database response:', data);
    return convertMemberFromDB(data);
  },

  async update(id: string, updates: Partial<Omit<Member, 'id' | 'attendanceHistory'>>): Promise<Member> {
    const dbUpdates: Partial<Tables['members']['Update']> = {};
    
    if (updates.memberNumber) dbUpdates.member_number = updates.memberNumber;
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.department) dbUpdates.department = updates.department;
    if (updates.baptismStatus) dbUpdates.baptism_status = updates.baptismStatus;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.joinDate) dbUpdates.join_date = updates.joinDate;
    if (updates.birthDate) dbUpdates.birth_date = updates.birthDate;
    if (updates.address) dbUpdates.address = updates.address;
    if (updates.photo !== undefined) dbUpdates.photo = updates.photo || null;

    const { data, error } = await supabase
      .from('members')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating member:', error);
      throw error;
    }

    return convertMemberFromDB(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  }
};

// Attendance
export const attendanceService = {
  async getAll(): Promise<AttendanceRecord[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('service_date', { ascending: false });

    if (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }

    return data.map(record => ({
      id: record.id,
      memberId: record.member_id,
      serviceDate: record.service_date,
      serviceType: record.service_type,
      present: record.present,
      notes: record.notes || undefined
    }));
  },

  async create(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        member_id: record.memberId,
        service_date: record.serviceDate,
        service_type: record.serviceType,
        present: record.present,
        notes: record.notes || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating attendance record:', error);
      throw error;
    }

    return {
      id: data.id,
      memberId: data.member_id,
      serviceDate: data.service_date,
      serviceType: data.service_type,
      present: data.present,
      notes: data.notes || undefined
    };
  }
};

// Donations
export const donationsService = {
  async getAll(): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }

    return data.map(donation => ({
      id: donation.id,
      memberId: donation.member_id,
      amount: donation.amount,
      category: donation.category,
      date: donation.date,
      method: donation.method,
      notes: donation.notes || undefined,
      receiptSent: donation.receipt_sent
    }));
  },

  async create(donation: Omit<Donation, 'id'>): Promise<Donation> {
    const { data, error } = await supabase
      .from('donations')
      .insert({
        member_id: donation.memberId,
        amount: donation.amount,
        category: donation.category,
        date: donation.date,
        method: donation.method,
        notes: donation.notes || null,
        receipt_sent: donation.receiptSent
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating donation:', error);
      throw error;
    }

    return {
      id: data.id,
      memberId: data.member_id,
      amount: data.amount,
      category: data.category,
      date: data.date,
      method: data.method,
      notes: data.notes || undefined,
      receiptSent: data.receipt_sent
    };
  }
};

// Visitors
export const visitorsService = {
  async getAll(): Promise<Visitor[]> {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('visit_date', { ascending: false });

    if (error) {
      console.error('Error fetching visitors:', error);
      throw error;
    }

    return data.map(visitor => ({
      id: visitor.id,
      name: visitor.name,
      phone: visitor.phone,
      email: visitor.email || undefined,
      visitDate: visitor.visit_date,
      invitedBy: visitor.invited_by || undefined,
      followUpStatus: visitor.follow_up_status,
      notes: visitor.notes || undefined
    }));
  },

  async create(visitor: Omit<Visitor, 'id'>): Promise<Visitor> {
    const { data, error } = await supabase
      .from('visitors')
      .insert({
        name: visitor.name,
        phone: visitor.phone,
        email: visitor.email || null,
        visit_date: visitor.visitDate,
        invited_by: visitor.invitedBy || null,
        follow_up_status: visitor.followUpStatus,
        notes: visitor.notes || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating visitor:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      visitDate: data.visit_date,
      invitedBy: data.invited_by || undefined,
      followUpStatus: data.follow_up_status,
      notes: data.notes || undefined
    };
  },

  async updateFollowUp(id: string, status: Visitor['followUpStatus']): Promise<Visitor> {
    const { data, error } = await supabase
      .from('visitors')
      .update({ follow_up_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating visitor follow-up:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      visitDate: data.visit_date,
      invitedBy: data.invited_by || undefined,
      followUpStatus: data.follow_up_status,
      notes: data.notes || undefined
    };
  }
};

// Equipment
export const equipmentService = {
  async getAll(): Promise<Equipment[]> {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching equipment:', error);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      condition: item.condition,
      purchaseDate: item.purchase_date,
      value: item.value,
      location: item.location,
      notes: item.notes || undefined
    }));
  },

  async create(equipment: Omit<Equipment, 'id'>): Promise<Equipment> {
    const { data, error } = await supabase
      .from('equipment')
      .insert({
        name: equipment.name,
        category: equipment.category,
        condition: equipment.condition,
        purchase_date: equipment.purchaseDate,
        value: equipment.value,
        location: equipment.location,
        notes: equipment.notes || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating equipment:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      category: data.category,
      condition: data.condition,
      purchaseDate: data.purchase_date,
      value: data.value,
      location: data.location,
      notes: data.notes || undefined
    };
  },

  async update(id: string, updates: Partial<Omit<Equipment, 'id'>>): Promise<Equipment> {
    const dbUpdates: Partial<Tables['equipment']['Update']> = {};
    
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.condition) dbUpdates.condition = updates.condition;
    if (updates.purchaseDate) dbUpdates.purchase_date = updates.purchaseDate;
    if (updates.value !== undefined) dbUpdates.value = updates.value;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;

    const { data, error } = await supabase
      .from('equipment')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating equipment:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      category: data.category,
      condition: data.condition,
      purchaseDate: data.purchase_date,
      value: data.value,
      location: data.location,
      notes: data.notes || undefined
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting equipment:', error);
      throw error;
    }
  }
};

// Test database connection and table structure
export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('members')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Database connection test failed:', testError);
      return {
        connected: false,
        error: testError.message,
        details: testError
      };
    }
    
    console.log('Database connection successful');
    return {
      connected: true,
      error: null,
      details: null
    };
  } catch (error) {
    console.error('Database connection test error:', error);
    return {
      connected: false,
      error: error.message,
      details: error
    };
  }
};

// Message Templates
export const templatesService = {
  async getAll(): Promise<MessageTemplate[]> {
    const { data, error } = await supabase
      .from('message_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }

    return data.map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      content: template.content,
      type: template.type
    }));
  },

  async create(template: Omit<MessageTemplate, 'id'>): Promise<MessageTemplate> {
    const { data, error } = await supabase
      .from('message_templates')
      .insert({
        name: template.name,
        subject: template.subject,
        content: template.content,
        type: template.type
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      subject: data.subject,
      content: data.content,
      type: data.type
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('message_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
}; 