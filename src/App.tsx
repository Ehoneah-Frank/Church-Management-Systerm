import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MemberDirectory from './components/MemberDirectory';
import AttendanceTracking from './components/AttendanceTracking';
import Finances from './components/Finances';
import Communications from './components/Communications';
import VisitorFollowUp from './components/VisitorFollowUp';
import EquipmentTracker from './components/EquipmentTracker';
import { 
  Member, 
  AttendanceRecord, 
  Donation, 
  Visitor, 
  Equipment, 
  MessageTemplate 
} from './types';
import { 
  membersService, 
  attendanceService, 
  donationsService, 
  visitorsService, 
  equipmentService, 
  templatesService,
  testDatabaseConnection
} from './services/database';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data from Supabase...');
        setIsLoading(true);
        setError(null);

        // First test the database connection
        const connectionTest = await testDatabaseConnection();
        console.log('Database connection test result:', connectionTest);
        
        if (!connectionTest.connected) {
          throw new Error(`Database connection failed: ${connectionTest.error}`);
        }

        const [membersData, attendanceData, donationsData, visitorsData, equipmentData, templatesData] = await Promise.all([
          membersService.getAll(),
          attendanceService.getAll(),
          donationsService.getAll(),
          visitorsService.getAll(),
          equipmentService.getAll(),
          templatesService.getAll()
        ]);

        setMembers(membersData);
        setAttendance(attendanceData);
        setDonations(donationsData);
        setVisitors(visitorsData);
        setEquipment(equipmentData);
        setTemplates(templatesData);

        console.log('Data loading completed');
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        setError('Failed to load data from database');
        // No fallback to mock data - start with empty arrays
        setMembers([]);
        setAttendance([]);
        setDonations([]);
        setVisitors([]);
        setEquipment([]);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // No need for localStorage save effects - data is saved directly to Supabase

  // Clear all data (for development/testing)
  const clearAllData = () => {
    if (window.confirm('This will clear all data from the database. Are you sure?')) {
      setMembers([]);
      setAttendance([]);
      setDonations([]);
      setVisitors([]);
      setEquipment([]);
      setTemplates([]);
      setError(null);
    }
  };

  // Member management
  const handleAddMember = async (memberData: Omit<Member, 'id' | 'attendanceHistory'>) => {
    try {
      console.log('Attempting to add member:', memberData);
      const newMember = await membersService.create(memberData);
      console.log('Member added successfully:', newMember);
      setMembers(prev => [newMember, ...prev]);
    } catch (error) {
      console.error('Error adding member:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      alert(`Failed to add member: ${error.message || 'Unknown error'}`);
    }
  };

  const handleUpdateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      const updatedMember = await membersService.update(id, memberData);
      setMembers(prev => 
        prev.map(member => 
          member.id === id ? updatedMember : member
        )
      );
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member. Please try again.');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await membersService.delete(id);
        setMembers(prev => prev.filter(member => member.id !== id));
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Failed to delete member. Please try again.');
      }
    }
  };

  // Attendance management
  const handleMarkAttendance = async (recordData: Omit<AttendanceRecord, 'id'>) => {
    try {
      const newRecord = await attendanceService.create(recordData);
      setAttendance(prev => [newRecord, ...prev]);
      alert('Attendance recorded successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark attendance. Please try again.';
      
      // Show more helpful error messages
      if (errorMessage.includes('credentials') || errorMessage.includes('authentication')) {
        alert('Database connection issue: Please check if your Supabase credentials are properly configured in the .env.local file.');
      } else if (errorMessage.includes('already recorded')) {
        alert('Attendance has already been recorded for this date and service type. Please check existing records.');
      } else {
        alert(`Failed to mark attendance: ${errorMessage}`);
      }
    }
  };

  // Donation management
  const handleAddDonation = async (donationData: Omit<Donation, 'id'>) => {
    try {
      const newDonation = await donationsService.create(donationData);
      setDonations(prev => [newDonation, ...prev]);
      
      // Simulate SMS receipt sending
      if (donationData.receiptSent === false) {
        setTimeout(() => {
          setDonations(current => 
            current.map(d => 
              d.id === newDonation.id ? { ...d, receiptSent: true } : d
            )
          );
        }, 1000);
      }
    } catch (error) {
      console.error('Error adding donation:', error);
      alert('Failed to add donation. Please try again.');
    }
  };

  // Communication management
  const handleSendMessage = (memberIds: string[], message: string, type: 'sms' | 'email') => {
    // In a real app, this would integrate with SMS/email APIs
    console.log(`Sending ${type} to ${memberIds.length} members:`, message);
  };

  const handleSaveTemplate = async (templateData: Omit<MessageTemplate, 'id'>) => {
    try {
      const newTemplate = await templatesService.create(templateData);
      setTemplates(prev => [newTemplate, ...prev]);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await templatesService.delete(id);
      setTemplates(prev => prev.filter(template => template.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  // Visitor management
  const handleAddVisitor = async (visitorData: Omit<Visitor, 'id'>) => {
    try {
      const newVisitor = await visitorsService.create(visitorData);
      setVisitors(prev => [newVisitor, ...prev]);
    } catch (error) {
      console.error('Error adding visitor:', error);
      alert('Failed to add visitor. Please try again.');
    }
  };

  const handleUpdateFollowUp = async (id: string, status: Visitor['followUpStatus']) => {
    try {
      const updatedVisitor = await visitorsService.updateFollowUp(id, status);
      setVisitors(prev => 
        prev.map(visitor => 
          visitor.id === id ? updatedVisitor : visitor
        )
      );
    } catch (error) {
      console.error('Error updating visitor follow-up:', error);
      alert('Failed to update visitor follow-up. Please try again.');
    }
  };

  // Equipment management
  const handleAddEquipment = async (equipmentData: Omit<Equipment, 'id'>) => {
    try {
      const newEquipment = await equipmentService.create(equipmentData);
      setEquipment(prev => [newEquipment, ...prev]);
    } catch (error) {
      console.error('Error adding equipment:', error);
      alert('Failed to add equipment. Please try again.');
    }
  };

  const handleUpdateEquipment = async (id: string, equipmentData: Partial<Equipment>) => {
    try {
      const updatedEquipment = await equipmentService.update(id, equipmentData);
      setEquipment(prev => 
        prev.map(item => 
          item.id === id ? updatedEquipment : item
        )
      );
    } catch (error) {
      console.error('Error updating equipment:', error);
      alert('Failed to update equipment. Please try again.');
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentService.delete(id);
        setEquipment(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Failed to delete equipment. Please try again.');
      }
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            members={members}
            donations={donations}
            attendance={attendance}
            onViewChange={setCurrentView}
          />
        );
      case 'members':
        return (
          <MemberDirectory
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        );
      case 'attendance':
        return (
          <AttendanceTracking
            members={members}
            attendance={attendance}
            onMarkAttendance={handleMarkAttendance}
          />
        );
      case 'finances':
        return (
          <Finances
            members={members}
            donations={donations}
            onAddDonation={handleAddDonation}
          />
        );
      case 'communications':
        return (
          <Communications
            members={members}
            templates={templates}
            onSendMessage={handleSendMessage}
            onSaveTemplate={handleSaveTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        );
      case 'visitors':
        return (
          <VisitorFollowUp
            visitors={visitors}
            onAddVisitor={handleAddVisitor}
            onUpdateFollowUp={handleUpdateFollowUp}
          />
        );
      case 'equipment':
        return (
          <EquipmentTracker
            equipment={equipment}
            onAddEquipment={handleAddEquipment}
            onUpdateEquipment={handleUpdateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
          />
        );
      default:
        return <Dashboard members={members} donations={donations} attendance={attendance} onViewChange={setCurrentView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView} 
      onResetData={clearAllData}
      isLoading={isLoading}
      error={error}
    >
      {renderCurrentView()}
    </Layout>
  );
}

export default App;