import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import newRequest from '../utils/newRequest';
import toast, { Toaster } from 'react-hot-toast';




const UserDisplay = ({ userId }) => {
    const { data: user, isLoading } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => newRequest.get(`/users/${userId}`).then(res => res.data),
        staleTime: 1000 * 60 * 60, // Cache user data for 1 hour
    });

    if (isLoading) return (
        <div className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
    );

    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {user?.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <span className="text-sm text-gray-900">{user?.username || "N/A"}</span>
        </div>
    );
};

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
        <p className="mt-2 text-gray-600">You do not have any orders that match the current filter.</p>
    </div>
);

const Order = () => {
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // --- Data Fetching ---
    const { data: orders = [], isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: () => newRequest.get('/orders').then(res => res.data),
        enabled: !!currentUser,
    });

    // --- Mutation for status change ---
    const mutation = useMutation({
        mutationFn: ({ orderId, newStatus }) => newRequest.put(`/orders/${orderId}/status`, { status: newStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']);
            toast.success('Order status updated successfully!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update status.");
        }
    });

    // --- Filtering Logic ---
    const filteredAndSortedOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        let processedOrders = [...orders];

        if (filterStatus !== "All") {
            processedOrders = processedOrders.filter(order => order.status === filterStatus);
        }

        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            processedOrders = processedOrders.filter(order => 
                order.title.toLowerCase().includes(lowercasedFilter)
            );
        }
        
        processedOrders.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return processedOrders;
    }, [orders, filterStatus, searchTerm, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleStatusChange = (orderId, newStatus) => {
        mutation.mutate({ orderId, newStatus });
    };

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
            <Toaster position="top-center" />
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-purple-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div className="flex-grow">
                        <label htmlFor="search-orders" className="sr-only">Search orders</label>
                        <input
                            id="search-orders"
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                        <select
                            id="status-filter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
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
                                    <th onClick={() => handleSort('price')} className="cursor-pointer text-left py-3 px-4 font-semibold text-sm">Price</th>
                                    <th onClick={() => handleSort('createdAt')} className="cursor-pointer text-left py-3 px-4 font-semibold text-sm">Order Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                                    {currentUser.isSeller && <th className="text-left py-3 px-4 font-semibold text-sm">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAndSortedOrders.length > 0 ? (
                                    filteredAndSortedOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="py-4 px-4 font-medium text-gray-800">
                                                <Link to={`/gig/${order.gigId}`} className="hover:text-purple-600">{order.title}</Link>
                                            </td>
                                            <td className="py-4 px-4">
                                                {/* ✅ FIX: Use the new UserDisplay component */}
                                                <UserDisplay userId={currentUser.isSeller ? order.buyerId : order.sellerId} />
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">₹{order.price.toLocaleString()}</td>
                                            <td className="py-4 px-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 px-4"><StatusBadge status={order.status} /></td>
                                            {currentUser.isSeller && (
                                                <td className="py-4 px-4">
                                                    <select
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        value={order.status}
                                                        className="p-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        disabled={order.status === 'Completed' || order.status === 'Cancelled'}
                                                    >
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={currentUser.isSeller ? 6 : 5}>
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