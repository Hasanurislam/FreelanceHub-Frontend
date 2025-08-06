import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import newRequest from '../utils/newRequest';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../Component/Navbar';

// --- Helper Components ---
const StatusBadge = ({ status }) => {
    const statusStyles = {
      'In Progress': 'bg-blue-100 text-blue-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Completed': 'bg-purple-100 text-purple-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Pending': 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold leading-tight rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
};

const EmptyState = () => (
    <div className="text-center py-16 px-4 col-span-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">No Orders Found</h3>
        <p className="mt-2 text-gray-600">You do not have any orders to display.</p>
    </div>
);

const Order = () => {
    const [filterStatus, setFilterStatus] = useState("All");
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // --- Data Fetching ---
    const { data: orders = [], isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: () => newRequest.get('/orders').then(res => res.data),
        enabled: !!currentUser,
    });

    // --- Filtering Logic ---
    const filteredOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        if (filterStatus === "All") {
            return orders;
        }
        return orders.filter(order => order.status === filterStatus);
    }, [orders, filterStatus]);

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-10 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
                    <p className="text-gray-600 mt-2">Please log in to view your orders.</p>
                    <Link to="/login" className="mt-6 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Toaster position="top-center" />
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">Filter by status:</label>
                    <select
                        id="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {isLoading ? (
                    <p className="text-center text-gray-600">Loading your orders...</p>
                ) : error ? (
                    <p className="text-center text-red-600">Could not load orders.</p>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Gig</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">{currentUser.isSeller ? "Buyer" : "Seller"}</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Price</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => {
                                        const otherUser = currentUser.isSeller ? order.buyerId : order.sellerId;
                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 font-medium text-gray-800">
                                                    <Link to={`/gig/${order.gigId}`} className="hover:text-purple-600">{order.title}</Link>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600">
                                                    {otherUser?.username || "N/A"}
                                                </td>
                                                <td className="py-4 px-4 text-gray-600">₹{order.price.toLocaleString()}</td>
                                                <td className="py-4 px-4"><StatusBadge status={order.status} /></td>
                                                <td className="py-4 px-4">
                                                    <button onClick={() => navigate(`/message/${currentUser._id + otherUser._id}`)} className="text-purple-600 hover:underline font-semibold">
                                                        Contact
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5}>
                                            <EmptyState />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Order;
