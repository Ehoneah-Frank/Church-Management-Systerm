import React, { useState } from 'react';
import { Search, Plus, Filter, Phone, Mail, Calendar, Users as UsersIcon, Edit2, Trash2, Upload, X, Eye, MoreVertical } from 'lucide-react';
import { Member } from '../types';

interface MemberDirectoryProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id' | 'attendanceHistory'>) => void;
  onUpdateMember: (id: string, member: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({ 
  members, 
  onAddMember, 
  onUpdateMember, 
  onDeleteMember 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: '' as 'Faith' | 'Love' | 'Hope' | '',
    baptismStatus: 'not-baptized' as 'baptized' | 'not-baptized' | 'scheduled',
    status: 'active' as 'active' | 'inactive',
    joinDate: '',
    birthDate: '',
    address: '',
    photo: ''
  });

  const departments = ['Faith', 'Love', 'Hope'];
  
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesDepartment = !selectedDepartment || member.department === selectedDepartment;
    const matchesStatus = !selectedStatus || member.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        console.log('File converted to base64, length:', result.length);
        setFormData({ ...formData, photo: result });
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, photo: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department) {
      alert('Please select a group (Faith, Love, or Hope)');
      return;
    }
    
    const memberData = {
      ...formData,
      department: formData.department as 'Faith' | 'Love' | 'Hope'
    };
    
    if (editingMember) {
      onUpdateMember(editingMember.id, memberData);
      setEditingMember(null);
    } else {
      onAddMember(memberData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      department: '',
      baptismStatus: 'not-baptized',
      status: 'active',
      joinDate: '',
      birthDate: '',
      address: '',
      photo: ''
    });
    setShowAddForm(false);
  };

  const handleView = (member: Member) => {
    setViewingMember(member);
    setShowViewModal(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email,
      department: member.department as 'Faith' | 'Love' | 'Hope' | '',
      baptismStatus: member.baptismStatus,
      status: member.status,
      joinDate: member.joinDate,
      birthDate: member.birthDate,
      address: member.address,
      photo: member.photo || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      onDeleteMember(memberId);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Member Directory</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex items-center text-gray-600">
            <Filter className="h-5 w-5 mr-2" />
            <span className="text-sm">{filteredMembers.length} members</span>
          </div>
        </div>
      </div>

      {/* Add/Edit Member Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value as 'Faith' | 'Love' | 'Hope' | '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Group</option>
                <option value="Faith">Faith Group</option>
                <option value="Love">Love Group</option>
                <option value="Hope">Hope Group</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Baptism Status</label>
              <select
                value={formData.baptismStatus}
                onChange={(e) => setFormData({ ...formData, baptismStatus: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="not-baptized">Not Baptized</option>
                <option value="baptized">Baptized</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
              <input
                type="date"
                required
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <div className="space-y-4">
                {formData.photo ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.photo}
                      alt="Profile preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload a profile photo</p>
                      <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
                    </div>
                    <div className="flex justify-center">
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        Choose File
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingMember ? 'Update Member' : 'Add Member'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setEditingMember(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
              
              <div className="relative dropdown-container">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === member.id ? null : member.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                
                {dropdownOpen === member.id && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    <button
                      onClick={() => {
                        handleView(member);
                        setDropdownOpen(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        handleEdit(member);
                        setDropdownOpen(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(member.id);
                        setDropdownOpen(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-4 w-4" />
                <span className="capitalize">{member.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Baptism Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  member.baptismStatus === 'baptized' 
                    ? 'bg-blue-100 text-blue-800'
                    : member.baptismStatus === 'scheduled'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.baptismStatus.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new member.</p>
        </div>
      )}

      {/* View Member Modal */}
      {showViewModal && viewingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Member Details</h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingMember(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Member Photo */}
                <div className="flex justify-center">
                  {viewingMember.photo ? (
                    <img
                      src={viewingMember.photo}
                      alt={viewingMember.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {viewingMember.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{viewingMember.name}</h3>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full mt-2 ${
                      viewingMember.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {viewingMember.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{viewingMember.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{viewingMember.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <UsersIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 capitalize">{viewingMember.department}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Birth Date:</span>
                        <span className="text-gray-700">{new Date(viewingMember.birthDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Join Date:</span>
                        <span className="text-gray-700">{new Date(viewingMember.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Baptism Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          viewingMember.baptismStatus === 'baptized' 
                            ? 'bg-blue-100 text-blue-800'
                            : viewingMember.baptismStatus === 'scheduled'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {viewingMember.baptismStatus.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                  <p className="text-sm text-gray-700">{viewingMember.address}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => {
                    handleEdit(viewingMember);
                    setShowViewModal(false);
                    setViewingMember(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Member</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete(viewingMember.id);
                    setShowViewModal(false);
                    setViewingMember(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Member</span>
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingMember(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDirectory;