import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { SupportTicket, TicketStatus, TicketPriority, UserRole, TicketMessage } from '../types';
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
  
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');

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
      // Auto-update the active selected ticket's data if it is updated in the list
      if (selectedTicket) {
        const updatedSelected = res.data.find((t: SupportTicket) => t.id === selectedTicket.id);
        if (updatedSelected) {
          setSelectedTicket(updatedSelected);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    setLoadingMessages(true);
    try {
      const res = await api.get(`/support/tickets/${ticketId}/messages/`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch ticket messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/support/tickets/', newTicket);
      setShowCreateModal(false);
      setNewTicket({
        subject: '',
        description: '',
        priority: TicketPriority.MEDIUM,
        category: 'Technical Support'
      });
      await fetchTickets();
      // Auto-select the newly created ticket
      if (res.data) {
        handleSelectTicket(res.data);
      }
    } catch (error) {
      alert('Failed to create ticket');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessageText.trim()) return;
    try {
      await api.post(`/support/tickets/${selectedTicket.id}/messages/`, { message: newMessageText.trim() });
      setNewMessageText('');
      fetchMessages(selectedTicket.id);
      fetchTickets();
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    try {
      await api.patch(`/support/tickets/${id}/`, { status });
      await fetchTickets();
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: List of tickets */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
              <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredTickets.map((ticket) => {
                  const isSelected = selectedTicket?.id === ticket.id;
                  return (
                    <li key={ticket.id}>
                      <div 
                        onClick={() => handleSelectTicket(ticket)}
                        className={`px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50/50 border-l-4 border-indigo-600 pl-3' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0">
                            <div className="flex-shrink-0">
                              {getPriorityIcon(ticket.priority)}
                            </div>
                            <div className="ml-3">
                              <p className={`text-sm truncate ${isSelected ? 'font-bold text-indigo-700' : 'font-medium text-gray-900'}`}>{ticket.subject}</p>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <Tag className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                                <span className="mr-2 truncate max-w-[80px]">{ticket.category}</span>
                                <Clock className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(ticket.status)}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <UserIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                            {ticket.user_name}
                          </span>
                          {isSuperAdmin && (
                            <span className="flex items-center text-gray-400">
                              <SchoolIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                              {ticket.school_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
                {filteredTickets.length === 0 && (
                  <li className="px-4 py-12 text-center text-gray-500">
                    No tickets found.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Right panel: Active chat and details */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[600px]">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50/70 rounded-t-lg flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{selectedTicket.subject}</h4>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span>Category: <strong>{selectedTicket.category}</strong></span>
                      <span>•</span>
                      <span>Priority: <strong>{selectedTicket.priority}</strong></span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedTicket.status)}
                    {isSuperAdmin && selectedTicket.status !== TicketStatus.RESOLVED && (
                      <div className="flex items-center space-x-1 border-l pl-2 border-gray-200">
                        {selectedTicket.status !== TicketStatus.IN_PROGRESS && (
                          <button
                            onClick={() => updateTicketStatus(selectedTicket.id, TicketStatus.IN_PROGRESS)}
                            className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
                          >
                            In Progress
                          </button>
                        )}
                        <button
                          onClick={() => updateTicketStatus(selectedTicket.id, TicketStatus.RESOLVED)}
                          className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 font-medium"
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                  {/* Original Description */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {selectedTicket.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[85%] shadow-sm">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-xs font-bold text-gray-900">{selectedTicket.user_name}</span>
                        <span className="text-[10px] text-gray-400">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-800 whitespace-pre-line">{selectedTicket.description}</p>
                    </div>
                  </div>

                  {/* Replies */}
                  {loadingMessages ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isCurrentUser = msg.user_id === user?.id;
                      return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs flex-shrink-0 ${
                            msg.is_admin ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {msg.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div className={`rounded-lg p-3 max-w-[85%] shadow-sm ${
                            isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-800'
                          }`}>
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <span className={`text-xs font-bold ${isCurrentUser ? 'text-indigo-100' : 'text-gray-900'}`}>
                                {msg.user_name} {msg.is_admin && <span className="ml-1 text-[9px] uppercase tracking-wider bg-indigo-100 text-indigo-800 px-1 rounded">Admin</span>}
                              </span>
                              <span className={`text-[10px] ${isCurrentUser ? 'text-indigo-200' : 'text-gray-400'}`}>
                                {new Date(msg.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs whitespace-pre-line">{msg.message}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Send Reply Box */}
                {selectedTicket.status === TicketStatus.CLOSED || selectedTicket.status === TicketStatus.RESOLVED ? (
                  <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500 rounded-b-lg">
                    This ticket has been marked as <strong>{selectedTicket.status.toLowerCase()}</strong>. Submit a new ticket for further assistance.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Type your support reply here..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button type="submit" size="sm">
                      Reply
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center h-[600px] flex flex-col justify-center items-center text-gray-500 shadow-sm">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                <h4 className="font-bold text-gray-900 text-sm">No Ticket Selected</h4>
                <p className="text-xs max-w-sm mt-1 leading-relaxed">
                  Select an active support request from the list on the left to review the communication thread, manage status updates, or send a reply.
                </p>
              </div>
            )}
          </div>
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
