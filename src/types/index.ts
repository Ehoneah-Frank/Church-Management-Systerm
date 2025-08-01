export interface Member {
  id: string;
  memberNumber: number;
  name: string;
  phone: string;
  email: string;
  department: 'Faith' | 'Love' | 'Hope';
  baptismStatus: 'baptized' | 'not-baptized' | 'scheduled';
  status: 'active' | 'inactive';
  joinDate: string;
  birthDate: string;
  address: string;
  photo?: string;
  attendanceHistory: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  serviceDate: string;
  serviceType: 'sunday-encounter' | 'wednesday-miracle' | 'friday-prayer';
  totalCount: number;
  menCount: number;
  womenCount: number;
  youthCount: number;
  childrenCount: number;
  guestsCount: number;
  notes?: string;
}

export interface Donation {
  id: string;
  memberId: string;
  amount: number;
  category: 'tithe' | 'offering' | 'project' | 'special';
  date: string;
  method: 'cash' | 'check' | 'online' | 'transfer';
  notes?: string;
  receiptSent: boolean;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  visitDate: string;
  invitedBy?: string;
  followUpStatus: 'pending' | 'contacted' | 'completed';
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
  purchaseDate: string;
  value: number;
  location: string;
  notes?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'sms' | 'email';
}