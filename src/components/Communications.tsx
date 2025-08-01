import React, { useState } from 'react';
import { MessageSquare, Send, Users, BookTemplate as Template, Plus, Edit2, Trash2 } from 'lucide-react';
import { Member, MessageTemplate } from '../types';

interface CommunicationsProps {
  members: Member[];
  templates: MessageTemplate[];
  onSendMessage: (memberIds: string[], message: string, type: 'sms' | 'email') => void;
  onSaveTemplate: (template: Omit<MessageTemplate, 'id'>) => void;
  onDeleteTemplate: (id: string) => void;
}

const Communications: React.FC<CommunicationsProps> = ({ 
  members, 
  templates, 
  onSendMessage, 
  onSaveTemplate, 
  onDeleteTemplate 
}) => {
  const [activeTab, setActiveTab] = useState<'compose' | 'templates'>('compose');
  const [messageType, setMessageType] = useState<'sms' | 'email'>('sms');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'sms' as 'sms' | 'email'
  });

  const departments = [...new Set(members.map(m => m.department))];
  const activeMembers = members.filter(m => m.status === 'active');
  const filteredMembers = filterDepartment 
    ? activeMembers.filter(m => m.department === filterDepartment)
    : activeMembers;

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  const handleSendMessage = () => {
    if (selectedMembers.length > 0 && message.trim()) {
      onSendMessage(selectedMembers, message, messageType);
      setMessage('');
      setSubject('');
      setSelectedMembers([]);
      alert(`${messageType.toUpperCase()} sent to ${selectedMembers.length} members!`);
    }
  };

  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      // In a real app, you'd have an update function
      onDeleteTemplate(editingTemplate.id);
    }
    onSaveTemplate(templateForm);
    setTemplateForm({ name: '', subject: '', content: '', type: 'sms' });
    setShowTemplateForm(false);
    setEditingTemplate(null);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      content: template.content,
      type: template.type
    });
    setShowTemplateForm(true);
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setMessage(template.content);
    setSubject(template.subject);
    setMessageType(template.type);
    setActiveTab('compose');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'compose'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <MessageSquare className="h-5 w-5 inline mr-2" />
            Compose
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Template className="h-5 w-5 inline mr-2" />
            Templates
          </button>
        </div>
      </div>

      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Recipients</h2>
              
              <div className="space-y-4">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <button
                  onClick={handleSelectAll}
                  className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  {selectedMembers.length === filteredMembers.length ? 'Deselect All' : 'Select All'}
                  {filterDepartment && ` (${filterDepartment})`}
                </button>

                <div className="text-sm text-gray-600 text-center">
                  {selectedMembers.length} of {filteredMembers.length} selected
                </div>
              </div>

              <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMembers.includes(member.id)
                        ? 'bg-blue-50 border-blue-300'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleMemberToggle(member.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{member.department}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message Composition */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Message</h2>
              
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setMessageType('sms')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      messageType === 'sms'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    SMS
                  </button>
                  <button
                    onClick={() => setMessageType('email')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      messageType === 'email'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Email
                  </button>
                </div>

                {messageType === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Email subject..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message {messageType === 'sms' && '(160 characters max)'}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={messageType === 'sms' ? 160 : undefined}
                    rows={messageType === 'sms' ? 4 : 8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={`Type your ${messageType} message here...`}
                  />
                  {messageType === 'sms' && (
                    <div className="text-sm text-gray-500 text-right mt-1">
                      {message.length}/160 characters
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Available Variables:</h3>
                  <p className="text-sm text-yellow-700">
                    Use <code>{'{name}'}</code> to personalize messages with member names.
                  </p>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={selectedMembers.length === 0 || !message.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>
                    Send {messageType.toUpperCase()} to {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Message Templates</h2>
            <button
              onClick={() => setShowTemplateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Template</span>
            </button>
          </div>

          {/* Template Form */}
          {showTemplateForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              <form onSubmit={handleTemplateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                    <input
                      type="text"
                      required
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={templateForm.type}
                      onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                {templateForm.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={templateForm.subject}
                      onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    required
                    value={templateForm.content}
                    onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {editingTemplate ? 'Update' : 'Save'} Template
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateForm(false);
                      setEditingTemplate(null);
                      setTemplateForm({ name: '', subject: '', content: '', type: 'sms' });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Templates List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      template.type === 'sms' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {template.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {template.subject && (
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Subject: {template.subject}
                  </p>
                )}
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {template.content}
                </p>
                
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-12">
              <Template className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
              <p className="text-gray-500">Create your first message template to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Communications;