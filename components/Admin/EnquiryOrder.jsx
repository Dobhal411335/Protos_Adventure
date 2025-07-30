"use client";
import { useState, useEffect } from "react";
import { Search, Eye, Phone, Mail, X } from "lucide-react";
import toast from "react-hot-toast"
export default function EnquiryOrder() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/enquiryOrder');
      const data = await response.json();

      if (data.success) {
        setEnquiries(data.data);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'new' ? 'resolved' : 'new';
      const response = await fetch(`/api/enquiryOrder?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setEnquiries(enquiries.map(enquiry =>
          enquiry._id === id ? { ...enquiry, status: newStatus } : enquiry
        ));

        if (selectedEnquiry?._id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }

        // Show success toast with the new status
        toast.success(`Status updated to ${newStatus === 'resolved' ? 'Resolved' : 'New'}`);
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Open modal with enquiry details
  const openEnquiryDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEnquiry(null), 300);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEnquiries();
  }, []);


  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Enquiries</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enquiries.length > 0 ? (
                enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enquiry.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {enquiry.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {enquiry.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {enquiry.productName}
                      </div>
                      {enquiry.productPrice > 0 && (
                        <div className="text-sm text-gray-500">
                          ₹{enquiry.productPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Phone size={14} />
                        {enquiry.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleStatus(enquiry._id, enquiry.status)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${enquiry.status === 'resolved' ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`${enquiry.status === 'resolved' ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </button>
                      <span className="ml-2 text-xs font-medium">
                        {enquiry.status === 'resolved' ? 'Resolved' : 'New'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEnquiryDetails(enquiry)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No enquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isModalOpen ? 'scale-100' : 'scale-95'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-6 pb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Enquiry Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-700 transition-colors p-1 -mr-2"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Full Name</h3>
                  <p className="text-base text-gray-800 font-medium">{selectedEnquiry.fullName}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</h3>
                  <p className="text-base text-gray-800 break-all">{selectedEnquiry.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</h3>
                  <p className="text-base text-gray-800 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {selectedEnquiry.phone || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date</h3>
                  <p className="text-base text-gray-800">{formatDate(selectedEnquiry.createdAt)}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Product Details</h3>
                <div className="space-y-2">
                  <p className="text-base font-medium text-gray-800">{selectedEnquiry.productName}</p>
                  {selectedEnquiry.productPrice > 0 && (
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{selectedEnquiry.productPrice.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Message</h3>
                <div className="prose prose-sm max-w-none text-gray-800">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Update Status</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleStatus(selectedEnquiry._id, selectedEnquiry.status)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${selectedEnquiry.status === 'resolved' ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                    >
                      <span
                        className={`${selectedEnquiry.status === 'resolved' ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {selectedEnquiry.status === 'resolved' ? 'Marked as Resolved' : 'Mark as Resolved'}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${selectedEnquiry.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {selectedEnquiry.status === 'resolved' ? 'Resolved' : 'New'}
                  </span>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}