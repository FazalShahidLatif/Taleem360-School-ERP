import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Book, LibraryTransaction, Student, UserRole } from '../types';
import { useAuth } from '../lib/auth';
import { 
  Search, 
  Plus, 
  Book as BookIcon, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft,
  Filter,
  MoreVertical,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Clock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Library: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'books' | 'transactions'>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [transactions, setTransactions] = useState<LibraryTransaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showIssueBookModal, setShowIssueBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    quantity: 1,
    location: ''
  });

  const [issueData, setIssueData] = useState({
    book_id: '',
    student_id: '',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 14 days
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, transRes, studentsRes] = await Promise.all([
        api.get('/library/books/'),
        api.get('/library/transactions/'),
        api.get('/students/')
      ]);
      setBooks(booksRes.data);
      setTransactions(transRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Failed to fetch library data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/library/books/', newBook);
      setShowAddBookModal(false);
      setNewBook({ title: '', author: '', isbn: '', category: '', quantity: 1, location: '' });
      fetchData();
    } catch (error) {
      alert('Failed to add book');
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/library/issue/', issueData);
      setShowIssueBookModal(false);
      setIssueData({ book_id: '', student_id: '', due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
      fetchData();
    } catch (error) {
      alert('Failed to issue book');
    }
  };

  const handleReturnBook = async (transactionId: string) => {
    if (!window.confirm('Are you sure you want to mark this book as returned?')) return;
    try {
      await api.post(`/library/return/${transactionId}/`);
      fetchData();
    } catch (error) {
      alert('Failed to return book');
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/library/books/${id}/`);
      fetchData();
    } catch (error) {
      alert('Failed to delete book');
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn.includes(searchTerm)
  );

  const filteredTransactions = transactions.filter(t => 
    t.book_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-500">Manage books, issues, and returns for your school.</p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowIssueBookModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
            >
              <ArrowUpRight className="w-4 h-4" />
              Issue Book
            </button>
            <button
              onClick={() => setShowAddBookModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Book
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'books' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookIcon className="w-4 h-4" />
            Books Inventory
          </div>
          {activeTab === 'books' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'transactions' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Issue/Return History
          </div>
          {activeTab === 'transactions' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={activeTab === 'books' ? "Search by title, author, or ISBN..." : "Search by student or book..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'books' ? (
            <motion.div
              key="books"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <BookIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBook(book.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">by {book.author}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ISBN:</span>
                      <span className="font-medium">{book.isbn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{book.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{book.location || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-semibold">Availability</span>
                      <span className={`text-sm font-bold ${book.available_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.available_quantity} / {book.quantity} available
                      </span>
                    </div>
                    {isAdmin && book.available_quantity > 0 && (
                      <button 
                        onClick={() => {
                          setIssueData({ ...issueData, book_id: book.id });
                          setShowIssueBookModal(true);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Issue
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Book</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Issue Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{t.book_title}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{t.student_name}</td>
                      <td className="px-6 py-4 text-gray-600">{t.issue_date}</td>
                      <td className="px-6 py-4 text-gray-600">{t.due_date}</td>
                      <td className="px-6 py-4">
                        {t.status === 'RETURNED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3" />
                            Returned
                          </span>
                        ) : t.status === 'OVERDUE' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3" />
                            Issued
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isAdmin && t.status !== 'RETURNED' && (
                          <button
                            onClick={() => handleReturnBook(t.id)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-bold"
                          >
                            Mark Returned
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTransactions.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No transactions found.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
              <h2 className="text-xl font-bold">Add New Book</h2>
              <button onClick={() => setShowAddBookModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddBook} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Book Title</label>
                  <input
                    required
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    placeholder="e.g. The Great Gatsby"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Author</label>
                  <input
                    required
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    placeholder="e.g. F. Scott Fitzgerald"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">ISBN</label>
                    <input
                      required
                      type="text"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <input
                      required
                      type="text"
                      value={newBook.category}
                      onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      placeholder="e.g. Fiction"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={newBook.quantity}
                      onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newBook.location}
                      onChange={(e) => setNewBook({ ...newBook, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      placeholder="e.g. Shelf A1"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200"
                >
                  Add Book
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Issue Book Modal */}
      {showIssueBookModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
              <h2 className="text-xl font-bold">Issue Book</h2>
              <button onClick={() => setShowIssueBookModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleIssueBook} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Book</label>
                <select
                  required
                  value={issueData.book_id}
                  onChange={(e) => setIssueData({ ...issueData, book_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  <option value="">Choose a book...</option>
                  {books.filter(b => b.available_quantity > 0).map(b => (
                    <option key={b.id} value={b.id}>{b.title} ({b.available_quantity} available)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Student</label>
                <select
                  required
                  value={issueData.student_id}
                  onChange={(e) => setIssueData({ ...issueData, student_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  <option value="">Choose a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.enrollment_number})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
                <input
                  required
                  type="date"
                  value={issueData.due_date}
                  onChange={(e) => setIssueData({ ...issueData, due_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowIssueBookModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200"
                >
                  Issue Book
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
