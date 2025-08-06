import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../Component/Navbar"; 


const UserDisplay = ({ userId }) => {
    const { data: user, isLoading } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => newRequest.get(`/users/${userId}`).then(res => res.data),
        staleTime: 1000 * 60 * 60, // Cache user data for 1 hour to avoid re-fetching
    });

    if (isLoading) return (
        <div className="flex items-center gap-2 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
    );

    return (
        <div className="flex items-center gap-2">
            <img src={user?.img || "/img/noavatar.png"} alt={user?.username} className="w-8 h-8 rounded-full object-cover" />
            <span className="font-medium">{user?.username || 'Seller'}</span>
        </div>
    );
};



const GigCard = ({ gig }) => (
    <Link to={`/gig/${gig._id}`} className="block group">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition h-full flex flex-col">
            <div className="relative">
                <img src={gig.cover} alt={gig.title} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-3">
                    <UserDisplay userId={gig.userId} />
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition cursor-pointer">{gig.title}</h3>
                <div className="flex items-center gap-1 text-sm mb-3">
                    <span className="text-amber-400">★</span>
                    <span>{gig.starNumber > 0 ? (gig.totalStars / gig.starNumber).toFixed(1) : 'New'}</span>
                    <span className="text-gray-500">({gig.starNumber})</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center mt-auto">
                    <div className="text-xs text-gray-500">Starting at</div>
                    <div className="font-bold text-lg">₹{gig.price}</div>
                </div>
            </div>
        </div>
    </Link>
);

// --- Helper Component for Skeleton Loading ---
const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="border-t pt-3 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    </div>
);


const Gigs = () => {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState(0); // State for delivery time
  const minRef = useRef();
  const maxRef = useRef();
  const { search } = useLocation();

  const { isLoading, error, data: gigs, refetch } = useQuery({
    queryKey: ["gigs", sort, search, minRef.current?.value, maxRef.current?.value, deliveryTime],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search ? search + "&" : "?"}min=${minRef.current?.value || ''}&max=${maxRef.current?.value || ''}&sort=${sort}&deliveryTime=${deliveryTime}`
        )
        .then((res) => res.data),
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    refetch();
  };

  const handleDeliveryTimeChange = (e) => {
    setDeliveryTime(e.target.value);
  };

  const handleReset = () => {
    if (minRef.current) minRef.current.value = "";
    if (maxRef.current) maxRef.current.value = "";
    setDeliveryTime(0);
    refetch();
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 h-fit bg-white rounded-lg shadow-sm p-6 order-2 lg:order-1">
                    <h3 className="font-bold text-xl mb-4">Filters</h3>
                    <div className="border-b pb-4 mb-4">
                        <h4 className="font-semibold mb-3">Budget</h4>
                        <div className="flex gap-2 items-center mb-3">
                            <input ref={minRef} type="number" placeholder="Min" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none transition" />
                            <span>-</span>
                            <input ref={maxRef} type="number" placeholder="Max" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none transition" />
                        </div>
                    </div>
                    <div className="border-b pb-4 mb-4">
                        <h4 className="font-semibold mb-3">Delivery Time</h4>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
                                <input type="radio" name="deliveryTime" value={1} checked={deliveryTime === "1"} onChange={handleDeliveryTimeChange} className="rounded-full text-purple-500 focus:ring-purple-300" />
                                <span>Express (24h)</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
                                <input type="radio" name="deliveryTime" value={3} checked={deliveryTime === "3"} onChange={handleDeliveryTimeChange} className="rounded-full text-purple-500 focus:ring-purple-300" />
                                <span>Up to 3 Days</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
                                <input type="radio" name="deliveryTime" value={7} checked={deliveryTime === "7"} onChange={handleDeliveryTimeChange} className="rounded-full text-purple-500 focus:ring-purple-300" />
                                <span>Up to 7 Days</span>
                            </label>
                             <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
                                <input type="radio" name="deliveryTime" value={0} checked={deliveryTime === 0} onChange={handleDeliveryTimeChange} className="rounded-full text-purple-500 focus:ring-purple-300" />
                                <span>Anytime</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={apply} className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition flex-1 font-semibold">Apply</button>
                        <button onClick={handleReset} className="bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition flex-1 font-semibold">Reset</button>
                    </div>
                </aside>
                
                {/* Main Content */}
                <main className="flex-1 order-1 lg:order-2">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h1 className="text-3xl font-bold mb-2 md:mb-0">All Services</h1>
                        <div className="relative">
                            <button onClick={() => setOpen(!open)} className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50 transition">
                                <span>Sort by: {sort === "sales" ? "Best Selling" : "Newest"}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {open && (
                                <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg overflow-hidden z-20 w-48 border">
                                    <ul>
                                        <li onClick={() => reSort("sales")} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Best Selling</li>
                                        <li onClick={() => reSort("createdAt")} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Newest</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Gig Card Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        ) : error ? (
                            <p className="col-span-full text-center text-red-500">Failed to load gigs.</p>
                        ) : gigs && gigs.length > 0 ? (
                            gigs.map((gig) => <GigCard key={gig._id} gig={gig} />)
                        ) : (
                            <p className="col-span-full text-center text-gray-600 py-16">No gigs found.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
      </div>
    </>
  );
};

export default Gigs;