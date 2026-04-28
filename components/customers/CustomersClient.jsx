'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  UserPlus, 
  Send, 
  Trash2, 
  Users,
  Mail,
  Phone,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import AddCustomerModal from './AddCustomerModal';
import BulkImportModal from './BulkImportModal';

export default function CustomersClient({ 
  customers, 
  totalCount,
  currentPage,
  totalPages,
  search 
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(search);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [sendingTo, setSendingTo] = useState(null);

  // Search with debounce
  const handleSearch = (value) => {
    setSearchQuery(value);
    const params = new URLSearchParams();
    if (value) params.set('search', value);
    params.set('page', '1');
    router.push(`/customers?${params.toString()}`);
  };

  // Send review request to single customer
  const handleSendRequest = async (customer) => {
    setSendingTo(customer._id);
    try {
      const res = await fetch('/api/reviews/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success(`Request sent to ${customer.name}! ⭐`);
      router.refresh();

    } catch (err) {
      toast.error('Failed to send request');
    } finally {
      setSendingTo(null);
    }
  };

  // Delete customer
  const handleDelete = async (customerId, customerName) => {
    if (!confirm(`Delete ${customerName}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Customer deleted');
        router.refresh();
      }
    } catch (err) {
      toast.error('Failed to delete customer');
    }
  };

  // Bulk send requests
  const handleBulkSend = async () => {
    if (selectedCustomers.length === 0) {
      toast.error('Select customers first');
      return;
    }

    const confirmed = confirm(
      `Send review requests to ${selectedCustomers.length} customers?`
    );
    if (!confirmed) return;

    let successCount = 0;
    for (const customerId of selectedCustomers) {
      const customer = customers.find(c => c._id === customerId);
      if (!customer) continue;

      try {
        const res = await fetch('/api/reviews/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone
          })
        });

        if (res.ok) successCount++;
      } catch (err) {
        console.error('Bulk send error:', err);
      }
    }

    toast.success(`✅ Sent ${successCount} review requests!`);
    setSelectedCustomers([]);
    router.refresh();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Requests Sent', 'Added Date'];
    const rows = customers.map(c => [
      c.name,
      c.email,
      c.phone || '',
      c.requestCount,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded!');
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(c => c._id));
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Customers
          </h1>
          <p className="text-gray-500 mt-1">
            {totalCount} total customers
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition text-sm font-medium"
          >
            <Users size={16} />
            Bulk Import
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition text-sm font-medium shadow-sm"
          >
            <UserPlus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search + Bulk Actions */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>

        {selectedCustomers.length > 0 && (
          <button
            onClick={handleBulkSend}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
          >
            <Send size={16} />
            Send to {selectedCustomers.length} selected
          </button>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {customers.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400">
              {search ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {search 
                ? 'Try a different search term'
                : 'Add your first customer to send a review request'
              }
            </p>
            {!search && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition mx-auto"
              >
                <UserPlus size={16} />
                Add First Customer
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCustomers.length === customers.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-3">Contact</div>
              <div className="col-span-2">Requests</div>
              <div className="col-span-2">Last Sent</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-50">
              {customers.map(customer => (
                <div
                  key={customer._id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center ${
                    selectedCustomers.includes(customer._id) 
                      ? 'bg-purple-50' 
                      : ''
                  }`}
                >
                  {/* Checkbox */}
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer._id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCustomers(prev => [...prev, customer._id]);
                        } else {
                          setSelectedCustomers(prev => 
                            prev.filter(id => id !== customer._id)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </div>

                  {/* Name + Avatar */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Added {formatDate(customer.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Mail size={13} className="text-gray-400" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                        <Phone size={12} />
                        {customer.phone}
                      </div>
                    )}
                  </div>

                  {/* Request Count */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      customer.requestCount > 0
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Send size={11} />
                      {customer.requestCount} sent
                    </span>
                  </div>

                  {/* Last Sent */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={12} />
                      {formatDate(customer.lastRequestSent)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center gap-1">
                    <button
                      onClick={() => handleSendRequest(customer)}
                      disabled={sendingTo === customer._id}
                      title="Send review request"
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition disabled:opacity-50"
                    >
                      {sendingTo === customer._id ? (
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={15} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id, customer.name)}
                      title="Delete customer"
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalCount)} of {totalCount} customers
                </p>
                <div className="flex gap-2">
                  <a
                    href={`/customers?page=${currentPage - 1}&search=${search}`}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage <= 1
                        ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </a>
                  <a
                    href={`/customers?page=${currentPage + 1}&search=${search}`}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      currentPage >= totalPages
                        ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Next
                    <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddCustomerModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            router.refresh();
          }}
        />
      )}

      {showBulkModal && (
        <BulkImportModal
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            setShowBulkModal(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}