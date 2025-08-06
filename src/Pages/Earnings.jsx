import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import newRequest from '../utils/newRequest';
import Navbar from '../Component/Navbar';
import {FiCheckCircle, FiPackage, FiGrid } from 'react-icons/fi';
import { MdCurrencyRupee } from "react-icons/md";

// --- Helper Components ---
const StatCard = ({ icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4`}>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const Earnings = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // --- Data Fetching ---
    const { data: stats, isLoading } = useQuery({
        queryKey: ['sellerStats'],
        queryFn: () => newRequest.get('/users/stats/seller').then(res => res.data),
        enabled: !!currentUser?.isSeller,
    });

    if (!currentUser || !currentUser.isSeller) {
        return (
            <>
            <Navbar/>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-10 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
                    <p className="text-gray-600 mt-2">You must be a seller to view your earnings.</p>
                    <Link to="/become-seller" className="mt-6 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        Become a Seller
                    </Link>
                </div>
            </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">My Earnings</h1>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <p className="text-center">Loading your earnings data...</p>
                    ) : (
                        <>
                            {/* Earnings Stats Section */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard icon={<MdCurrencyRupee size={24} />} title="Total Earnings" value={`₹${stats?.totalEarnings?.toLocaleString() || '0'}`} color="green" />
                                    <StatCard icon={<FiCheckCircle size={24} />} title="Completed Orders" value={stats?.completedOrders || '0'} color="blue" />
                                    <StatCard icon={<FiPackage size={24} />} title="Active Orders" value={stats?.activeOrders || '0'} color="yellow" />
                                    <StatCard icon={<FiGrid size={24} />} title="Total Gigs" value={stats?.gigs || '0'} color="purple" />
                                </div>
                            </section>

                            {/* Recent Transactions Section */}
                            <section>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                                        <ul className="divide-y divide-gray-200">
                                            {stats.recentTransactions.map(order => (
                                                <li key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-purple-700">{order.title}</p>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Order ID: <span className="font-medium">{order._id}</span>
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-lg text-green-600">+ ₹{order.price.toLocaleString()}</p>
                                                            <p className="text-sm text-gray-500">{new Date(order.updatedAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="p-12 text-center text-gray-600">You have no completed transactions yet.</p>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>
        </>
    );
};

export default Earnings;
