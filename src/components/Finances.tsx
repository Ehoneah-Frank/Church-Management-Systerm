import React, { useState } from 'react';
import { DollarSign, Plus, TrendingUp, Receipt, Calendar, User, Filter } from 'lucide-react';
import { Member, Donation } from '../types';

interface FinancesProps {
  members: Member[];
  donations: Donation[];
  onAddDonation: (donation: Omit<Donation, 'id'>) => void;
}

const Finances: React.FC<FinancesProps> = ({ members, donations, onAddDonation }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    category: 'tithe' as const,
    date: new Date().toISOString().split('T')[0],
    method: 'cash' as const,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDonation({
      ...formData,
      amount: parseFloat(formData.amount),
      receiptSent: false
    });
    setFormData({
      memberId: '',
      amount: '',
      category: 'tithe',
      date: new Date().toISOString().split('T')[0],
      method: 'cash',
      notes: ''
    });
    setShowAddForm(false);
  };

  // Filter donations
  const filteredDonations = donations.filter(donation => {
    const matchesCategory = !selectedCategory || donation.category === selectedCategory;
    const matchesMonth = !selectedMonth || donation.date.startsWith(selectedMonth);
    return matchesCategory && matchesMonth;
  });

  // Calculate totals
  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
  const titheTotal = filteredDonations.filter(d => d.category === 'tithe').reduce((sum, d) => sum + d.amount, 0);
  const offeringTotal = filteredDonations.filter(d => d.category === 'offering').reduce((sum, d) => sum + d.amount, 0);
  const projectTotal = filteredDonations.filter(d => d.category === 'project').reduce((sum, d) => sum + d.amount, 0);

  // Top givers (current month)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthDonations = donations.filter(d => d.date.startsWith(currentMonth));
  const topGivers = members
    .map(member => ({
      member,
      total: currentMonthDonations
        .filter(d => d.memberId === member.id)
        .reduce((sum, d) => sum + d.amount, 0)
    }))
    .filter(g => g.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const stats = [
    { name: 'Total Income', value: `GH₵${totalAmount.toLocaleString()}`, color: 'bg-green-500', icon: DollarSign },
    { name: 'Tithes', value: `GH₵${titheTotal.toLocaleString()}`, color: 'bg-blue-500', icon: TrendingUp },
    { name: 'Offerings', value: `GH₵${offeringTotal.toLocaleString()}`, color: 'bg-purple-500', icon: Receipt },
    { name: 'Projects', value: `GH₵${projectTotal.toLocaleString()}`, color: 'bg-yellow-500', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Record Donation</span>
        </button>
      </div>

      {/* Stats Cards */}
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
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="tithe">Tithe</option>
              <option value="offering">Offering</option>
              <option value="project">Project</option>
              <option value="special">Special</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Total Records</p>
              <p className="text-2xl font-bold text-green-600">{filteredDonations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Donation Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Record New Donation</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member</label>
              <select
                required
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Member</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (GH₵)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="project">Project Fund</option>
                <option value="special">Special Collection</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="online">Online Transfer</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Additional notes..."
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Record Donation
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Donations</h2>
          <div className="space-y-3">
            {filteredDonations.slice(0, 10).map((donation) => {
              const member = members.find(m => m.id === donation.memberId);
              return (
                <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {donation.category} • {donation.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">GH₵{donation.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Givers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Contributors (This Month)</h2>
          <div className="space-y-3">
            {topGivers.map((giver, index) => (
              <div key={giver.member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{giver.member.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{giver.member.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">GH₵{giver.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {topGivers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No donations this month</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finances;