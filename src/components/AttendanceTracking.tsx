import React, { useState } from 'react';
import { Calendar, Users, Check, X, Plus, BarChart3, UserCheck, Baby, Users2, UserPlus } from 'lucide-react';
import { Member, AttendanceRecord } from '../types';

interface AttendanceTrackingProps {
  members: Member[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

interface AttendanceCountData {
  totalCount: number;
  menCount: number;
  womenCount: number;
  youthCount: number;
  childrenCount: number;
  guestsCount: number;
  notes: string;
}

const AttendanceTracking: React.FC<AttendanceTrackingProps> = ({ 
  members, 
  attendance, 
  onMarkAttendance 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceType, setServiceType] = useState<'sunday-encounter' | 'wednesday-miracle' | 'friday-prayer'>('sunday-encounter');
  const [showCountForm, setShowCountForm] = useState(false);
  const [countData, setCountData] = useState<AttendanceCountData>({
    totalCount: 0,
    menCount: 0,
    womenCount: 0,
    youthCount: 0,
    childrenCount: 0,
    guestsCount: 0,
    notes: ''
  });

  const todayAttendance = attendance.filter(
    record => record.serviceDate === selectedDate && record.serviceType === serviceType
  );

  // Get today's attendance count (there should be only one record per service per day)
  const todayRecord = todayAttendance[0];
  
  // Calculate total stats
  const totalAttendanceToday = todayRecord?.totalCount || 0;
  const menToday = todayRecord?.menCount || 0;
  const womenToday = todayRecord?.womenCount || 0;
  const youthToday = todayRecord?.youthCount || 0;
  const childrenToday = todayRecord?.childrenCount || 0;
  const guestsToday = todayRecord?.guestsCount || 0;

  const handleSubmitCountAttendance = () => {
    // Check if attendance already exists for this date and service
    const existingRecord = attendance.find(
      a => a.serviceDate === selectedDate && a.serviceType === serviceType
    );

    if (existingRecord) {
      alert('Attendance already recorded for this date and service. Please edit the existing record.');
      return;
    }

    // Validate that counts make sense
    const calculatedTotal = countData.menCount + countData.womenCount + countData.youthCount + countData.childrenCount + countData.guestsCount;
    if (countData.totalCount !== calculatedTotal) {
      alert(`Total count (${countData.totalCount}) doesn't match the sum of individual counts (${calculatedTotal}). Please check your numbers.`);
      return;
    }

    onMarkAttendance({
      serviceDate: selectedDate,
      serviceType,
      totalCount: countData.totalCount,
      menCount: countData.menCount,
      womenCount: countData.womenCount,
      youthCount: countData.youthCount,
      childrenCount: countData.childrenCount,
      guestsCount: countData.guestsCount,
      notes: countData.notes
    });

    // Reset form
    setCountData({
      totalCount: 0,
      menCount: 0,
      womenCount: 0,
      youthCount: 0,
      childrenCount: 0,
      guestsCount: 0,
      notes: ''
    });
    setShowCountForm(false);
  };

  const handleCountChange = (field: keyof AttendanceCountData, value: string | number) => {
    setCountData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : value
    }));
  };

  // Monthly stats
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyAttendance = attendance.filter(a => a.serviceDate.startsWith(currentMonth));
  const monthlyTotalAttendance = monthlyAttendance.reduce((sum, record) => sum + record.totalCount, 0);
  const monthlyAverageAttendance = monthlyAttendance.length > 0 
    ? Math.round(monthlyTotalAttendance / monthlyAttendance.length)
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
          onClick={() => setShowCountForm(true)}
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

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-500">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{totalAttendanceToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-indigo-500">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Men</p>
              <p className="text-xl font-bold text-gray-900">{menToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-pink-500">
              <Users2 className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Women</p>
              <p className="text-xl font-bold text-gray-900">{womenToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-500">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Youth</p>
              <p className="text-xl font-bold text-gray-900">{youthToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-500">
              <Baby className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Children</p>
              <p className="text-xl font-bold text-gray-900">{childrenToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-500">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Guests</p>
              <p className="text-xl font-bold text-gray-900">{guestsToday}</p>
            </div>
          </div>
        </div>
      </div>



      {/* Count-based Attendance Form Modal */}
      {showCountForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Mark Attendance Count - {serviceTypeLabels[serviceType]}
                </h2>
                <button
                  onClick={() => setShowCountForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Attendance Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={countData.totalCount}
                    onChange={(e) => handleCountChange('totalCount', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold text-center"
                    placeholder="0"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Breakdown by Category</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Men</label>
                      <input
                        type="number"
                        min="0"
                        value={countData.menCount}
                        onChange={(e) => handleCountChange('menCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Women</label>
                      <input
                        type="number"
                        min="0"
                        value={countData.womenCount}
                        onChange={(e) => handleCountChange('womenCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Youth</label>
                      <input
                        type="number"
                        min="0"
                        value={countData.youthCount}
                        onChange={(e) => handleCountChange('youthCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Children</label>
                      <input
                        type="number"
                        min="0"
                        value={countData.childrenCount}
                        onChange={(e) => handleCountChange('childrenCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Guests</label>
                      <input
                        type="number"
                        min="0"
                        value={countData.guestsCount}
                        onChange={(e) => handleCountChange('guestsCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={countData.notes}
                    onChange={(e) => handleCountChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about the service..."
                  />
                </div>

                {/* Validation display */}
                {countData.totalCount > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Total:</strong> {countData.totalCount} |{' '}
                      <strong>Breakdown Sum:</strong> {countData.menCount + countData.womenCount + countData.youthCount + countData.childrenCount + countData.guestsCount}
                      {countData.totalCount !== (countData.menCount + countData.womenCount + countData.youthCount + countData.childrenCount + countData.guestsCount) && (
                        <span className="text-red-600 ml-2">⚠️ Numbers don't match!</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCountForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCountAttendance}
                  disabled={countData.totalCount === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Save Attendance
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Men/Women</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Youth/Children</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.slice(0, 10).map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.serviceDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {serviceTypeLabels[record.serviceType]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {record.totalCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.menCount}/{record.womenCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.youthCount}/{record.childrenCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.guestsCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {record.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracking;