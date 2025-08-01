import { Member, AttendanceRecord, Donation, Visitor, Equipment, MessageTemplate } from '../types';

export const mockMembers: Member[] = [
  {
    id: '1',
    memberNumber: 1001,
    name: 'John Smith',
    phone: '+1234567890',
    email: 'john.smith@email.com',
    department: 'Faith',
    baptismStatus: 'baptized',
    status: 'active',
    joinDate: '2020-01-15',
    birthDate: '1985-03-20',
    address: '123 Main St, City, State',
    photo: '',
    attendanceHistory: []
  },
  {
    id: '2',
    memberNumber: 1002,
    name: 'Sarah Johnson',
    phone: '+1234567891',
    email: 'sarah.johnson@email.com',
    department: 'Love',
    baptismStatus: 'baptized',
    status: 'active',
    joinDate: '2019-06-10',
    birthDate: '1990-07-15',
    address: '456 Oak Ave, City, State',
    photo: '',
    attendanceHistory: []
  },
  {
    id: '3',
    memberNumber: 1003,
    name: 'Michael Brown',
    phone: '+1234567892',
    email: 'michael.brown@email.com',
    department: 'Hope',
    baptismStatus: 'not-baptized',
    status: 'active',
    joinDate: '2023-02-28',
    birthDate: '1995-12-08',
    address: '789 Pine St, City, State',
    photo: '',
    attendanceHistory: []
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    serviceDate: '2024-01-07',
    serviceType: 'sunday-encounter',
    totalCount: 150,
    menCount: 45,
    womenCount: 65,
    youthCount: 25,
    childrenCount: 15,
    guestsCount: 8,
    notes: 'Great service with good participation'
  },
  {
    id: '2',
    serviceDate: '2024-01-10',
    serviceType: 'wednesday-miracle',
    totalCount: 85,
    menCount: 25,
    womenCount: 35,
    youthCount: 15,
    childrenCount: 8,
    guestsCount: 2,
    notes: 'Midweek service'
  },
  {
    id: '3',
    serviceDate: '2024-01-12',
    serviceType: 'friday-prayer',
    totalCount: 65,
    menCount: 20,
    womenCount: 30,
    youthCount: 10,
    childrenCount: 3,
    guestsCount: 2,
    notes: 'Prayer and fasting session'
  }
];

export const mockDonations: Donation[] = [
  {
    id: '1',
    memberId: '1',
    amount: 500,
    category: 'tithe',
    date: '2024-01-07',
    method: 'cash',
    receiptSent: true
  },
  {
    id: '2',
    memberId: '2',
    amount: 100,
    category: 'offering',
    date: '2024-01-07',
    method: 'check',
    receiptSent: true
  }
];

export const mockVisitors: Visitor[] = [
  {
    id: '1',
    name: 'Jane Doe',
    phone: '+1234567893',
    email: 'jane.doe@email.com',
    visitDate: '2024-01-07',
    invitedBy: 'John Smith',
    followUpStatus: 'pending',
    notes: 'Interested in joining the choir'
  }
];

export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Digital Projector',
    category: 'AV Equipment',
    condition: 'good',
    purchaseDate: '2022-05-15',
    value: 15000,
    location: 'Main Sanctuary',
    notes: 'Needs new filter soon'
  },
  {
    id: '2',
    name: 'Drum Set',
    category: 'Musical Instruments',
    condition: 'excellent',
    purchaseDate: '2023-08-20',
    value: 8000,
    location: 'Music Room'
  }
];

export const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Birthday Wishes',
    subject: 'Happy Birthday!',
    content: 'Dear {name}, Wishing you a blessed birthday filled with joy and God\'s grace!',
    type: 'sms'
  },
  {
    id: '2',
    name: 'Service Reminder',
    subject: 'Sunday Service Reminder',
    content: 'Don\'t forget about tomorrow\'s service at 10 AM. We look forward to seeing you!',
    type: 'sms'
  },
  {
    id: '3',
    name: 'Service Cancellation',
    subject: 'Service Cancelled',
    content: 'Due to unforeseen circumstances, today\'s service has been cancelled. Please stay safe!',
    type: 'sms'
  }
];