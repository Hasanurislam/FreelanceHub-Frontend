import React, { useEffect, useState } from 'react';
import newRequest from '../utils/newRequest';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

// --- Helper Component for the Delete Modal ---
const DeleteModal = ({ gig, onCancel, onConfirm }) => {
  if (!gig) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">Confirm Deletion</h4>
        <p className="text-gray-600 mb-5">
          Are you sure you want to delete "<strong>{gig.title}</strong>"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            onClick={() => onConfirm(gig._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gigToDelete, setGigToDelete] = useState(null); // State for modal

  const fetchMyGigs = async () => {
    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem('currentUser'))?._id;
      if (!userId) {
        setLoading(false);
        return;
      }
      const res = await newRequest.get(`/gigs/mygigs/${userId}`);
      setGigs(res.data);
    } catch (err) {
      console.error('Failed to load gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gigId) => {
    try {
      await newRequest.delete(`/gigs/${gigId}`);
      setGigs(prev => prev.filter(gig => gig._id !== gigId));
      setGigToDelete(null); // Close modal on success
    } catch (err) {
      console.error("Failed to delete gig:", err);
    }
  };

  useEffect(() => {
    fetchMyGigs();
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16">
        {/* ✨ Purple Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-600">Loading your gigs...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Gigs</h1>
            {/* ✨ Purple Button */}
            <Link to="/add" className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors hidden sm:block">
             + Create New Gig
            </Link>
        </div>

        {gigs.length === 0 ? (
          // --- Empty State ---
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">You haven't created any gigs yet</h3>
            <p className="text-gray-600 mb-6">Start offering your services by creating your first gig.</p>
            {/* ✨ Purple Button */}
            <Link to="/addgig" className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Create a New Gig
            </Link>
          </div>
        ) : (
          // --- Gig List ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div key={gig._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={gig.cover} alt={gig.title} className="w-full h-full object-cover"/>
                  {/* ✨ Purple Price Badge */}
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ₹{new Intl.NumberFormat('en-IN').format(gig.price)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{gig.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {gig.shortDesc}
                  </p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    {/* ✨ Purple Button */}
                    <Link to={`/gig/${gig._id}`} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                      View
                    </Link>
                    <button
                      className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-500 transition-colors flex items-center gap-2 text-sm"
                      onClick={() => setGigToDelete(gig)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* ✨ Add New Gig Card with Purple Hover */}
            <Link to="/add" className="bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:text-purple-600 text-gray-500 transition-colors duration-300 flex items-center justify-center min-h-[300px]">
              <div className="text-center p-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="font-semibold text-lg mb-1">Create a New Gig</h3>
                <p className="text-sm">Offer a new service to potential clients.</p>
              </div>
            </Link>

          </div>
        )}
      </div>

      {/* Render the modal outside the main content flow */}
      <DeleteModal
        gig={gigToDelete}
        onCancel={() => setGigToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
    </>
  );
};

export default MyGigs;