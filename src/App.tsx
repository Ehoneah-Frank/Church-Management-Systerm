import { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import MemberDirectory from './components/MemberDirectory';
import AttendanceTracking from './components/AttendanceTracking';
import Finances from './components/Finances';
import EquipmentTracker from './components/EquipmentTracker';
import VisitorFollowUp from './components/VisitorFollowUp';
import Communications from './components/Communications';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import { useAuth } from './lib/AuthContext';
import { membersService, attendanceService, donationsService, visitorsService, equipmentService } from './services/database';
import { Member, Donation, AttendanceRecord, Visitor, Equipment } from './types';
import { Loader2 } from 'lucide-react';
import UserManagement from './components/UserManagement';
import { supabase } from './lib/supabase';

export default function App() {
  const { user, role, loading: authLoading } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const membersLoadedRef = useRef(false);

  // Handler functions for members
  const handleAddMember = async (member: Omit<Member, 'id' | 'attendanceHistory'>) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to add members.");
      return;
    }
    try {
      const newMember = await membersService.create(member);
      setMembers(prevMembers => [newMember, ...prevMembers]);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleUpdateMember = async (id: string, updates: Partial<Member>) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to update members.");
      return;
    }
    try {
      const updatedMember = await membersService.update(id, updates);
      setMembers(prevMembers => prevMembers.map(m => (m.id === id ? updatedMember : m)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to delete members.");
      return;
    }
    try {
      await membersService.delete(id);
      setMembers(prevMembers => prevMembers.filter(m => m.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Handler functions for attendance
  const handleMarkAttendance = async (record: Omit<AttendanceRecord, 'id'>) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to mark attendance.");
      return;
    }
    try {
      const newAttendance = await attendanceService.create(record);
      setAttendance(prevAttendance => [newAttendance, ...prevAttendance]);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Handler functions for donations
  const handleAddDonation = async (donation: Omit<Donation, 'id'>) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to record donations.");
      return;
    }
    try {
      const newDonation = await donationsService.create(donation);
      setDonations(prevDonations => [newDonation, ...prevDonations]);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Handler functions for visitors
  const handleAddVisitor = async (visitor: Omit<Visitor, 'id'>) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to add visitors.");
      return;
    }
    try {
      const newVisitor = await visitorsService.create(visitor);
      setVisitors(prevVisitors => [newVisitor, ...prevVisitors]);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleUpdateFollowUp = async (id: string, status: Visitor['followUpStatus']) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to update visitor follow-up.");
      return;
    }
    try {
      const updatedVisitor = await visitorsService.updateFollowUp(id, status);
      setVisitors(prevVisitors => prevVisitors.map(v => (v.id === id ? updatedVisitor : v)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Handler functions for equipment
  const handleAddEquipment = async (equipmentItem: Omit<Equipment, 'id'>) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to add equipment.");
      return;
    }
    try {
      const newEquipment = await equipmentService.create(equipmentItem);
      setEquipment(prevEquipment => [newEquipment, ...prevEquipment]);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleUpdateEquipment = async (id: string, updates: Partial<Equipment>) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to update equipment.");
      return;
    }
    try {
      const updatedEquipment = await equipmentService.update(id, updates);
      setEquipment(prevEquipment => prevEquipment.map(e => (e.id === id ? updatedEquipment : e)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (role !== 'Admin' && role !== 'superAdmin') {
      alert("You don't have permission to delete equipment.");
      return;
    }
    try {
      await equipmentService.delete(id);
      setEquipment(prevEquipment => prevEquipment.filter(e => e.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Communications handlers
  const handleSendMessage = async (memberIds: string[], message: string, type: 'sms' | 'email') => {
    console.log('Sending message:', { memberIds, message, type });
    // Implement your message sending logic here
  };

  const handleSaveTemplate = async (template: any) => {
    console.log('Saving template:', template);
    // Implement template saving logic
  };

  const handleDeleteTemplate = async (id: string) => {
    console.log('Deleting template:', id);
    // Implement template deletion logic
  };

  // Load data when user is authenticated
  useEffect(() => {
    if (user && !authLoading && !membersLoadedRef.current) {
      setDataLoading(true);
      setError(null);
      membersLoadedRef.current = true;
      
      Promise.all([
        membersService.getAll(),
        donationsService.getAll(),
        attendanceService.getAll(),
        visitorsService.getAll(),
        equipmentService.getAll()
      ])
        .then(([membersData, donationsData, attendanceData, visitorsData, equipmentData]) => {
          setMembers(membersData);
          setDonations(donationsData);
          setAttendance(attendanceData);
          setVisitors(visitorsData);
          setEquipment(equipmentData);
        })
        .catch(e => {
          setError(e.message);
          membersLoadedRef.current = false;
        })
        .finally(() => {
          setDataLoading(false);
        });
    } else if (!user && !authLoading) {
      setMembers([]);
      setDonations([]);
      setAttendance([]);
      setVisitors([]);
      setEquipment([]);
      setDataLoading(false);
      setError(null);
      membersLoadedRef.current = false;
    }
  }, [user, authLoading]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-lg text-gray-700">Loading Community Hub...</p>
          <p className="text-sm text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if no user
  if (!user) {
    return <AuthForm />;
  }

  // Show error if there was one
  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-500">
          <p>Error loading data: {error}</p>
          <button 
            onClick={() => {
              setError(null);
              membersLoadedRef.current = false;
              window.location.reload();
            }} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  // Show main app with routing
  return (
    <Layout>
      <Routes>
        <Route 
          path="/" 
          element={
            <Dashboard
              members={members}
              donations={donations}
              attendance={attendance}
              onViewChange={() => {}}
            />
          } 
        />
        <Route path="/dashboard" element={
          <Dashboard
            members={members}
            donations={donations}
            attendance={attendance}
            onViewChange={() => {}}
          />
        } />
        <Route 
          path="/members" 
          element={
            <MemberDirectory
              members={members}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
            />
          } 
        />
        <Route 
          path="/attendance" 
          element={
            <AttendanceTracking
              members={members}
              attendance={attendance}
              onMarkAttendance={handleMarkAttendance}
            />
          } 
        />
        <Route 
          path="/finances" 
          element={
            <Finances
              members={members}
              donations={donations}
              onAddDonation={handleAddDonation}
            />
          } 
        />
        <Route 
          path="/communications" 
          element={
            <Communications
              members={members}
              templates={[]}
              onSendMessage={handleSendMessage}
              onSaveTemplate={handleSaveTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          } 
        />
        <Route 
          path="/visitors" 
          element={
            <VisitorFollowUp
              visitors={visitors}
              onAddVisitor={handleAddVisitor}
              onUpdateFollowUp={handleUpdateFollowUp}
            />
          } 
        />
        <Route 
          path="/equipment" 
          element={
            <EquipmentTracker
              equipment={equipment}
              onAddEquipment={handleAddEquipment}
              onUpdateEquipment={handleUpdateEquipment}
              onDeleteEquipment={handleDeleteEquipment}
            />
          } 
        />
        <Route 
          path="/users" 
          element={
            <UserManagement />
          } 
        />
      </Routes>
    </Layout>
  );
}

const forceLogout = async () => {
  try {
    console.log('Force logout: Starting...');
    
    // Clear Supabase session with global scope
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clear all browser storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cached data
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Force reload to login page
    window.location.replace('/');
    
    console.log('Force logout: Completed');
  } catch (error) {
    console.error('Force logout error:', error);
    // Force reload anyway
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/');
  }
};