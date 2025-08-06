import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../utils/newRequest';
import { Toaster } from 'react-hot-toast';
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
        <svg xmlns="http://www.w.3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">No Orders Found</h3>
        <p className="mt-2 text-gray-600">You do not have any orders in this category.</p>
    </div>
);

const Order = () => {
    const [view, setView] = useState('selling'); // 'selling' or 'buying'
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // --- Data Fetching ---
    // ✅ NEW: Separate queries for selling and buying orders.
    // This query fetches orders where the user is the SELLER.
    const { data: sellingOrders = [], isLoading: isLoadingSelling, error: sellingError } = useQuery({
        queryKey: ['orders', 'selling'],
        queryFn: () => newRequest.get('/orders').then(res => res.data),
        enabled: !!currentUser?.isSeller, // Only run if the user is a seller
    });

    // This query fetches orders where the user is the BUYER.
    // NOTE: This requires a new backend endpoint like '/api/orders/buying'
    // that specifically fetches orders where the logged-in user is the buyerId.
    const { data: buyingOrders = [], isLoading: isLoadingBuying, error: buyingError } = useQuery({
        queryKey: ['orders', 'buying'],
        queryFn: () => newRequest.get('/orders/buying').then(res => res.data),
        enabled: !!currentUser, // All users can be buyers
    });

    const orders = view === 'selling' ? sellingOrders : buyingOrders;
    const isLoading = view === 'selling' ? isLoadingSelling : isLoadingBuying;
    const error = view === 'selling' ? sellingError : buyingError;

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
                {/* ✅ NEW: Tabs for switching between Selling and Buying views */}
                <div className="mb-8 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {currentUser.isSeller && (
                            <button
                                onClick={() => setView('selling')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    view === 'selling' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Selling
                            </button>
                        )}
                        <button
                            onClick={() => setView('buying')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                view === 'buying' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Buying
                        </button>
                    </nav>
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
                                    <th className="text-left py-3 px-4 font-semibold text-sm">{view === 'selling' ? "Buyer" : "Seller"}</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Price</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.length > 0 ? (
                                    orders.map((order) => {
                                        const otherUser = view === 'selling' ? order.buyerId : order.sellerId;
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