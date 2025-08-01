import React, { useState } from 'react';
import { Calendar, Users, Check, X, Plus, BarChart3, UserCheck, Baby, Users2, UserPlus } from 'lucide-react';
import { Member, AttendanceRecord } from '../types';

interface AttendanceTrackingProps {
  members: Member[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

interface AttendanceFormData {
  [memberId: string]: {
    present: boolean;
    category: 'youth' | 'children' | 'guests' | 'regular';
    notes?: string;
  };
}

interface NumberAttendanceEntry {
  memberNumber: number;
  present: boolean;
  category: 'youth' | 'children' | 'guests' | 'regular';
  notes?: string;
}

const AttendanceTracking: React.FC<AttendanceTrackingProps> = ({ 
  members, 
  attendance, 
  onMarkAttendance 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceType, setServiceType] = useState<'sunday-encounter' | 'wednesday-miracle' | 'friday-prayer'>('sunday-encounter');
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState<AttendanceFormData>({});
  const [showNumberForm, setShowNumberForm] = useState(false);
  const [numberAttendanceEntries, setNumberAttendanceEntries] = useState<NumberAttendanceEntry[]>([]);
  const [memberNumberInput, setMemberNumberInput] = useState('');
  const [currentEntryCategory, setCurrentEntryCategory] = useState<'youth' | 'children' | 'guests' | 'regular'>('regular');
  const [currentEntryNotes, setCurrentEntryNotes] = useState('');

  const todayAttendance = attendance.filter(
    record => record.serviceDate === selectedDate && record.serviceType === serviceType
  );

  const activeMembers = members.filter(m => m.status === 'active');
  
  // Calculate stats by category
  const getMembersByGroup = (group: 'Faith' | 'Love' | 'Hope') => {
    return activeMembers.filter(m => m.department === group);
  };

  const faithMembers = getMembersByGroup('Faith');
  const loveMembers = getMembersByGroup('Love');
  const hopeMembers = getMembersByGroup('Hope');

  // Calculate attendance by group
  const getAttendanceByGroup = (group: 'Faith' | 'Love' | 'Hope') => {
    const groupMembers = getMembersByGroup(group);
    const groupAttendance = todayAttendance.filter(a => 
      groupMembers.some(m => m.id === a.memberId)
    );
    return {
      total: groupMembers.length,
      present: groupAttendance.filter(a => a.present).length,
      rate: groupMembers.length > 0 ? Math.round((groupAttendance.filter(a => a.present).length / groupMembers.length) * 100) : 0
    };
  };

  const faithStats = getAttendanceByGroup('Faith');
  const loveStats = getAttendanceByGroup('Love');
  const hopeStats = getAttendanceByGroup('Hope');

  const handleMemberToggle = (memberId: string, present: boolean, category: 'youth' | 'children' | 'guests' | 'regular') => {
    setAttendanceForm(prev => ({
      ...prev,
      [memberId]: {
        present,
        category,
        notes: prev[memberId]?.notes || ''
      }
    }));
  };

  const handleSubmitAttendance = () => {
    Object.entries(attendanceForm).forEach(([memberId, data]) => {
      // Check if attendance already exists for this member, date, and service
      const existingRecord = attendance.find(
        a => a.memberId === memberId && 
             a.serviceDate === selectedDate && 
             a.serviceType === serviceType
      );

      if (!existingRecord) {
        onMarkAttendance({
          memberId,
          serviceDate: selectedDate,
          serviceType,
          present: data.present,
          notes: data.notes
        });
      }
    });

    setAttendanceForm({});
    setShowMarkForm(false);
  };

  const handleAddMemberByNumber = (present: boolean) => {
    const memberNumber = parseInt(memberNumberInput);
    if (!memberNumber) return;

    const member = activeMembers.find(m => m.memberNumber === memberNumber);
    if (!member) {
      alert('Member number not found!');
      return;
    }

    // Check if already marked for today
    const existingRecord = attendance.find(
      a => a.memberId === member.id && 
           a.serviceDate === selectedDate && 
           a.serviceType === serviceType
    );

    if (existingRecord) {
      alert('Attendance already marked for this member today!');
      return;
    }

    // Check if already in current entries
    const existingEntry = numberAttendanceEntries.find(e => e.memberNumber === memberNumber);
    if (existingEntry) {
      // Update existing entry
      setNumberAttendanceEntries(prev => 
        prev.map(entry => 
          entry.memberNumber === memberNumber 
            ? { ...entry, present, category: currentEntryCategory, notes: currentEntryNotes }
            : entry
        )
      );
    } else {
      // Add new entry
      setNumberAttendanceEntries(prev => [...prev, {
        memberNumber,
        present,
        category: currentEntryCategory,
        notes: currentEntryNotes
      }]);
    }

    // Reset form
    setMemberNumberInput('');
    setCurrentEntryNotes('');
  };

  const handleSubmitNumberAttendance = () => {
    numberAttendanceEntries.forEach(entry => {
      const member = activeMembers.find(m => m.memberNumber === entry.memberNumber);
      if (member) {
        onMarkAttendance({
          memberId: member.id,
          serviceDate: selectedDate,
          serviceType,
          present: entry.present,
          notes: entry.notes
        });
      }
    });

    setNumberAttendanceEntries([]);
    setShowNumberForm(false);
  };

  const handleRemoveNumberEntry = (memberNumber: number) => {
    setNumberAttendanceEntries(prev => prev.filter(e => e.memberNumber !== memberNumber));
  };

  // Monthly stats
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyAttendance = attendance.filter(a => a.serviceDate.startsWith(currentMonth));
  const monthlyAverage = monthlyAttendance.length > 0 
    ? Math.round(monthlyAttendance.filter(a => a.present).length / monthlyAttendance.length * 100)
    : 0;

  const serviceTypeLabels = {
    'sunday-encounter': 'Sunday Encounter Service',
    'wednesday-miracle': 'Wednesday Miracle Service', 
    'friday-prayer': 'Friday Prayer Fest'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Tracking</h1>
        <button
          onClick={() => setShowNumberForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Mark Attendance</span>
        </button>
      </div>

      {/* Service Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sunday-encounter">Sunday Encounter Service</option>
              <option value="wednesday-miracle">Wednesday Miracle Service</option>
              <option value="friday-prayer">Friday Prayer Fest</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <p className="font-medium">{serviceTypeLabels[serviceType]}</p>
              <p>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faith Group</p>
              <p className="text-2xl font-bold text-gray-900">{faithStats.present}/{faithStats.total}</p>
              <p className="text-sm text-gray-500">{faithStats.rate}% attendance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Love Group</p>
              <p className="text-2xl font-bold text-gray-900">{loveStats.present}/{loveStats.total}</p>
              <p className="text-sm text-gray-500">{loveStats.rate}% attendance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hope Group</p>
              <p className="text-2xl font-bold text-gray-900">{hopeStats.present}/{hopeStats.total}</p>
              <p className="text-sm text-gray-500">{hopeStats.rate}% attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Form Modal */}
      {showMarkForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Mark Attendance - {serviceTypeLabels[serviceType]}
                </h2>
                <button
                  onClick={() => setShowMarkForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Faith Group */}
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Faith Group ({faithMembers.length} members)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {faithMembers.map(member => (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.phone}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMemberToggle(member.id, true, 'regular')}
                              className={`px-3 py-1 rounded text-xs ${
                                attendanceForm[member.id]?.present === true
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleMemberToggle(member.id, false, 'regular')}
                              className={`px-3 py-1 rounded text-xs ${
                                attendanceForm[member.id]?.present === false
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMemberToggle(member.id, attendanceForm[member.id]?.present || false, 'youth')}
                            className={`px-2 py-1 rounded text-xs ${
                              attendanceForm[member.id]?.category === 'youth'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Youth
                          </button>
                          <button
                            onClick={() => handleMemberToggle(member.id, attendanceForm[member.id]?.present || false, 'children')}
                            className={`px-2 py-1 rounded text-xs ${
                              attendanceForm[member.id]?.category === 'children'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Children
                          </button>
                          <button
                            onClick={() => handleMemberToggle(member.id, attendanceForm[member.id]?.present || false, 'guests')}
                            className={`px-2 py-1 rounded text-xs ${
                              attendanceForm[member.id]?.category === 'guests'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Guests
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Love Group */}
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Love Group ({loveMembers.length} members)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loveMembers.map(member => (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.phone}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMemberToggle(member.id, true, 'regular')}
                              className={`px-3 py-1 rounded text-xs ${
                                attendanceForm[member.id]?.present === true
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleMemberToggle(member.id, false, 'regular')}
                              className={`px-3 py-1 rounded text-xs ${
                                attendanceForm[member.id]?.present === false
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMemberToggle(member.id, attendanceForm[member.id]?.present || false, 'youth')}
                            className={`px-2 py-1 rounded text-xs ${
                              attendanceForm[member.id]?.category === 'youth'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Youth
                          </button>
                          <button
                            onClick={() => handleMemberToggle(member.id, attendanceForm[member.id]?.present || false, 'children')}
                            className={`px-2 py-1 rounded text-xs ${
                              attendanceForm[member.id]?.category === 'children'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Children
                          </button>
                          <button
                            onClick={() => handleMemberToggle(member.id, attendanceForm[member.id]?.present || false, 'guests')}
                            className={`px-2 py-1 rounded text-xs ${
                              attendanceForm[member.id]?.category === 'guests'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Guests
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hope Group */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Hope Group ({hopeMembers.length} members)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hopeMembers.map(member => (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.phone}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMemberToggle(member.id, true, 'regular')}
                              className={`px-3 py-1 rounded text-xs ${
                                attendanceForm[member.id]?.present === true
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleMemberToggle(member.id, false, 'regular')}
                              className={`px-3 py-1 rounded text-xs ${
                                attendanceForm[member.id]?.present === false
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMemberToggle(member.id, attendanceForm[member.id]?.present || false, 'youth')}
                            className={`px-2 py-1 rounded text-xs ${
                              attendanceForm[member.id]?.category === 'youth'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Youth
                          </button>
                          <button
                            onClick={() => handleMemberToggle(member.id, attendanceForm[member.id]?.present || false, 'children')}
                            className={`px-2 py-1 rounded text-xs ${
                              attendanceForm[member.id]?.category === 'children'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Children
                          </button>
                          <button
                            onClick={() => handleMemberToggle(member.id, attendanceForm[member.id]?.present || false, 'guests')}
                            className={`px-2 py-1 rounded text-xs ${
                              attendanceForm[member.id]?.category === 'guests'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Guests
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowMarkForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAttendance}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Number-based Attendance Form Modal */}
      {showNumberForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Mark Attendance by Number - {serviceTypeLabels[serviceType]}
                </h2>
                <button
                  onClick={() => setShowNumberForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Member Number Input Form */}
              <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Number
                    </label>
                    <input
                      type="number"
                      value={memberNumberInput}
                      onChange={(e) => setMemberNumberInput(e.target.value)}
                      placeholder="Enter member number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddMemberByNumber(true);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={currentEntryCategory}
                      onChange={(e) => setCurrentEntryCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="regular">Regular</option>
                      <option value="youth">Youth</option>
                      <option value="children">Children</option>
                      <option value="guests">Guests</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={currentEntryNotes}
                    onChange={(e) => setCurrentEntryNotes(e.target.value)}
                    placeholder="Additional notes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAddMemberByNumber(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span>Mark Present</span>
                  </button>
                  <button
                    onClick={() => handleAddMemberByNumber(false)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Mark Absent</span>
                  </button>
                </div>
              </div>

              {/* Current Entries List */}
              {numberAttendanceEntries.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Attendance Entries ({numberAttendanceEntries.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {numberAttendanceEntries.map((entry) => {
                      const member = activeMembers.find(m => m.memberNumber === entry.memberNumber);
                      return (
                        <div
                          key={entry.memberNumber}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              #{entry.memberNumber}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900">
                                {member?.name || 'Unknown Member'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {member?.department} • {entry.category}
                              </p>
                              {entry.notes && (
                                <p className="text-xs text-gray-400">Notes: {entry.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              entry.present
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {entry.present ? 'Present' : 'Absent'}
                            </span>
                            <button
                              onClick={() => handleRemoveNumberEntry(entry.memberNumber)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Member Number Reference */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Quick Reference - Member Numbers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="font-medium text-red-600 mb-1">Faith Group</p>
                    {faithMembers.map(member => (
                      <div key={member.id} className="text-gray-700">
                        #{member.memberNumber} - {member.name}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-green-600 mb-1">Love Group</p>
                    {loveMembers.map(member => (
                      <div key={member.id} className="text-gray-700">
                        #{member.memberNumber} - {member.name}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-blue-600 mb-1">Hope Group</p>
                    {hopeMembers.map(member => (
                      <div key={member.id} className="text-gray-700">
                        #{member.memberNumber} - {member.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowNumberForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitNumberAttendance}
                  disabled={numberAttendanceEntries.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Save Attendance ({numberAttendanceEntries.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {todayAttendance.slice(0, 10).map((record) => {
                const member = members.find(m => m.id === record.memberId);
                return (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.serviceDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {serviceTypeLabels[record.serviceType]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member?.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.present
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracking;