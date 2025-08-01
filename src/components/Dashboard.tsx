import React from 'react';
import { Users, Calendar, DollarSign, UserPlus, TrendingUp, Gift } from 'lucide-react';
import { Member, Donation, AttendanceRecord } from '../types';

interface DashboardProps {
  members: Member[];
  donations: Donation[];
  attendance: AttendanceRecord[];
  onViewChange: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ members, donations, attendance, onViewChange }) => {
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyDonations = donations
    .filter(d => d.date.startsWith(thisMonth))
    .reduce((sum, d) => sum + d.amount, 0);

  // Calculate recent birthdays (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingBirthdays = members.filter(member => {
    const birthDate = new Date(member.birthDate);
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    return thisYearBirthday >= today && thisYearBirthday <= nextWeek;
  });

  const stats = [
    {
      name: 'Total Members',
      value: totalMembers,
      change: totalMembers > 0 ? `${activeMembers} active` : 'No members yet',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Monthly Donations',
      value: donations.length > 0 ? `GH₵${monthlyDonations.toLocaleString()}` : 'GH₵0',
      change: donations.length > 0 ? `GH₵${totalDonations.toLocaleString()} total` : 'No donations yet',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      name: 'Recent Attendance',
      value: attendance.filter(a => a.present).length,
      change: attendance.length > 0 ? `${attendance.length} total records` : 'No attendance records',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      name: 'Upcoming Birthdays',
      value: upcomingBirthdays.length,
      change: upcomingBirthdays.length > 0 ? 'Next 7 days' : 'No upcoming birthdays',
      icon: Gift,
      color: 'bg-yellow-500'
    }
  ];

  const quickActions = [
    {
      name: 'Add Member',
      description: 'Register a new church member',
      action: () => onViewChange('members'),
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Mark Attendance',
      description: 'Record service attendance',
      action: () => onViewChange('attendance'),
      icon: Calendar,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Record Donation',
      description: 'Log a new donation',
      action: () => onViewChange('finances'),
      icon: DollarSign,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'Add Visitor',
      description: 'Register a first-time visitor',
      action: () => onViewChange('visitors'),
      icon: UserPlus,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.name}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-lg transition-colors text-left`}
              >
                <IconComponent className="h-8 w-8 mb-3" />
                <h3 className="font-semibold text-lg mb-2">{action.name}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Upcoming Birthdays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Birthdays */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Birthdays</h2>
          {upcomingBirthdays.length > 0 ? (
            <div className="space-y-3">
              {upcomingBirthdays.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(member.birthDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming birthdays this week</p>
          )}
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          {donations.length > 0 ? (
            <div className="space-y-3">
              {donations.slice(-5).reverse().map((donation) => {
                const member = members.find(m => m.id === donation.memberId);
                return (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{member?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600 capitalize">{donation.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">GH₵{donation.amount}</p>
                      <p className="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent donations</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;