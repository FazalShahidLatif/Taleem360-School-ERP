import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { SupportTicket, TicketStatus, TicketPriority, UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Filter, 
  ChevronRight,
  User as UserIcon,
  School as SchoolIcon,
  Tag
} from 'lucide-react';

export const Tickets: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: TicketPriority.MEDIUM,
    category: 'Technical Support'
  });

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/tickets/');
      setTickets(res.data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/support/tickets/', newTicket);
      setShowCreateModal(false);
      setNewTicket({
        subject: '',
        description: '',
        priority: TicketPriority.MEDIUM,
        category: 'Technical Support'
      });
      fetchTickets();
    } catch (error) {
      alert('Failed to create ticket');
    }
  };

  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    try {
      await api.patch(`/support/tickets/${id}/`, { status });
      fetchTickets();
    } catch (error) {
      alert('Failed to update ticket status');
    }
  };

  const filteredTickets = filter === 'ALL' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Open</span>;
      case TicketStatus.IN_PROGRESS:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">In Progress</span>;
      case TicketStatus.RESOLVED:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Resolved</span>;
      case TicketStatus.CLOSED:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Closed</span>;
    }
  };

  const getPriorityIcon = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.URGENT:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case TicketPriority.HIGH:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case TicketPriority.MEDIUM:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case TicketPriority.LOW:
        return <AlertCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-indigo-600" />
            Support Tickets
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isSuperAdmin 
              ? 'Manage and respond to support requests from all schools.' 
              : 'Get help from our support team for any issues or questions.'}
          </p>
        </div>
        {!isSuperAdmin && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap items-center gap-4">
        <div className="flex items-center text-sm text-gray-500">
          <Filter className="w-4 h-4 mr-2" />
          Filter by Status:
        </div>
        <div className="flex space-x-2">
          {['ALL', ...Object.values(TicketStatus)].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === s 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <li key={ticket.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0">
                        {getPriorityIcon(ticket.priority)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-bold text-indigo-600 truncate">{ticket.subject}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Tag className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400" />
                          <span className="mr-3">{ticket.category}</span>
                          <Clock className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400" />
                          <span>Created on {new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(ticket.status)}
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-xs text-gray-500">
                        <UserIcon className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400" />
                        {ticket.user_name}
                      </p>
                      {isSuperAdmin && (
                        <p className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0 sm:ml-6">
                          <SchoolIcon className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-400" />
                          {ticket.school_name}
                        </p>
                      )}
                    </div>
                    {isSuperAdmin && ticket.status !== TicketStatus.RESOLVED && (
                      <div className="mt-2 flex items-center space-x-2 sm:mt-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTicketStatus(ticket.id, TicketStatus.IN_PROGRESS);
                          }}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Mark In Progress
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTicketStatus(ticket.id, TicketStatus.RESOLVED);
                          }}
                          className="text-xs font-medium text-green-600 hover:text-green-500"
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {filteredTickets.length === 0 && (
              <li className="px-4 py-12 text-center text-gray-500">
                No tickets found.
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Support Ticket</h3>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Brief summary of the issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option>Technical Support</option>
                    <option>Billing & Subscription</option>
                    <option>Feature Request</option>
                    <option>Account Access</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    {Object.values(TicketPriority).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewTicket({ ...newTicket, priority: p })}
                        className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${
                          newTicket.priority === p 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Please provide details about your issue..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button type="submit">Submit Ticket</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
