import React, { useState } from 'react';
import { UserPlus, Phone, Mail, Calendar, Clock, CheckCircle, Plus, AlertCircle } from 'lucide-react';
import { Visitor } from '../types';

interface VisitorFollowUpProps {
  visitors: Visitor[];
  onAddVisitor: (visitor: Omit<Visitor, 'id'>) => void;
  onUpdateFollowUp: (id: string, status: Visitor['followUpStatus']) => void;
}

const VisitorFollowUp: React.FC<VisitorFollowUpProps> = ({ 
  visitors, 
  onAddVisitor, 
  onUpdateFollowUp 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Visitor['followUpStatus'] | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    visitDate: new Date().toISOString().split('T')[0],
    invitedBy: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVisitor({
      ...formData,
      followUpStatus: 'pending'
    });
    setFormData({
      name: '',
      phone: '',
      email: '',
      visitDate: new Date().toISOString().split('T')[0],
      invitedBy: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const filteredVisitors = selectedStatus 
    ? visitors.filter(v => v.followUpStatus === selectedStatus)
    : visitors;

  const pendingCount = visitors.filter(v => v.followUpStatus === 'pending').length;
  const contactedCount = visitors.filter(v => v.followUpStatus === 'contacted').length;
  const completedCount = visitors.filter(v => v.followUpStatus === 'completed').length;

  const getStatusColor = (status: Visitor['followUpStatus']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Visitor['followUpStatus']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'contacted': return <Phone className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Visitor Follow-Up</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Visitor</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Follow-up</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contacted</p>
              <p className="text-2xl font-bold text-gray-900">{contactedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Visitors</option>
            <option value="pending">Pending Follow-up</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
          </select>
          <span className="text-sm text-gray-500">{filteredVisitors.length} visitors</span>
        </div>
      </div>

      {/* Add Visitor Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Visitor</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visit Date</label>
              <input
                type="date"
                required
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invited By (Optional)</label>
              <input
                type="text"
                value={formData.invitedBy}
                onChange={(e) => setFormData({ ...formData, invitedBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Any additional notes about the visitor..."
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Visitor
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

      {/* Visitors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisitors.map((visitor) => (
          <div key={visitor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {visitor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{visitor.name}</h3>
                  <p className="text-sm text-gray-500">
                    Visited {new Date(visitor.visitDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getStatusColor(visitor.followUpStatus)}`}>
                {getStatusIcon(visitor.followUpStatus)}
                <span className="ml-1 capitalize">{visitor.followUpStatus}</span>
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{visitor.phone}</span>
              </div>
              {visitor.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{visitor.email}</span>
                </div>
              )}
              {visitor.invitedBy && (
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Invited by {visitor.invitedBy}</span>
                </div>
              )}
            </div>
            
            {visitor.notes && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">{visitor.notes}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="text-xs text-gray-500 mb-2">Update Follow-up Status:</div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onUpdateFollowUp(visitor.id, 'pending')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    visitor.followUpStatus === 'pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => onUpdateFollowUp(visitor.id, 'contacted')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    visitor.followUpStatus === 'contacted'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                  }`}
                >
                  Contacted
                </button>
                <button
                  onClick={() => onUpdateFollowUp(visitor.id, 'completed')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    visitor.followUpStatus === 'completed'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                  }`}
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVisitors.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No visitors found</h3>
          <p className="text-gray-500">
            {selectedStatus 
              ? `No visitors with ${selectedStatus} status.`
              : 'Add your first visitor to get started with follow-up tracking.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default VisitorFollowUp;