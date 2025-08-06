import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import newRequest from '../utils/newRequest';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const mobileMenuRef = useRef();
  const mobileMenuButtonRef = useRef();
  const profileMenuRef = useRef();
  const profileMenuButtonRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auths/logout");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      navigate("/");
    } catch (err) {
      console.log("Logout failed:", err);
    }
  };

  // Close menus when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target) && profileMenuButtonRef.current && !profileMenuButtonRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(e.target)) {
        setOpenMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const UserMenu = ({ isMobile = false }) => (
    <div className={isMobile ? "w-full bg-gray-50" : "absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-200"} ref={profileMenuRef}>
      <ul className={`flex flex-col py-1 ${isMobile ? 'items-center' : ''}`}>
        <li className={`flex items-center w-full px-4 py-2 hover:bg-gray-100 cursor-pointer ${isMobile ? 'justify-center' : ''}`} onClick={() => { navigate("/gigs"); setOpenUserMenu(false); setOpenMobileMenu(false); }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span>Gigs</span>
        </li>
        {currentUser.isSeller && (
          <>
            <li className={`flex items-center w-full px-4 py-2 hover:bg-gray-100 cursor-pointer ${isMobile ? 'justify-center' : ''}`} onClick={() => { navigate("/mygigs"); setOpenUserMenu(false); setOpenMobileMenu(false); }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              <span>My Gigs</span>
            </li>
            <li className={`flex items-center w-full px-4 py-2 hover:bg-gray-100 cursor-pointer ${isMobile ? 'justify-center' : ''}`} onClick={() => { navigate("/add"); setOpenUserMenu(false); setOpenMobileMenu(false); }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Add New Gig</span>
            </li>
          </>
        )}
        <li className={`flex items-center w-full px-4 py-2 hover:bg-gray-100 cursor-pointer ${isMobile ? 'justify-center' : ''}`} onClick={() => { navigate("/orders"); setOpenUserMenu(false); setOpenMobileMenu(false); }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          <span>Orders</span>
        </li>
        <li className={`flex items-center w-full px-4 py-2 hover:bg-gray-100 cursor-pointer ${isMobile ? 'justify-center' : ''}`} onClick={() => { navigate("/messages"); setOpenUserMenu(false); setOpenMobileMenu(false); }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span>Messages</span>
        </li>
        <li className='flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer' onClick={() => { navigate("/earnings"); setOpenUserMenu(false); }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      <span>Earnings</span>
       </li>
        <li className={`flex items-center w-full px-4 py-2 hover:bg-red-100 text-red-600 font-bold cursor-pointer border-t mt-1 ${isMobile ? 'justify-center' : ''}`} onClick={handleLogout}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );

  const navLinkClasses = ({ isActive }) => 
    `py-2 transition-colors ${isActive ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-700 hover:text-purple-600'}`;

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          <div className="flex-1 flex items-center justify-start">
            <Link to="/">
              <img className='w-36 h-auto' src='/src/assets/freelancehub-high-resolution-logo-transparent (1).png' alt='Logo' />
            </Link>
          </div>
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center space-x-10 font-bold text-lg">
              <li><NavLink to="/gigs" className={navLinkClasses}>Explore</NavLink></li>
              <li><NavLink to="/" className={navLinkClasses} end>Home</NavLink></li>
              <li><NavLink to="/contact" className={navLinkClasses}>Contact Us</NavLink></li>
            </ul>
          </div>
          <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
            {currentUser ? (
              <>
                {!currentUser.isSeller && (
                    <button onClick={() => navigate('/become-seller')} className='text-purple-700 font-bold hover:text-purple-900 transition-colors'>
                        Become a Seller
                    </button>
                )}
                <div className="relative profile-menu">
                  <div ref={profileMenuButtonRef} className='flex items-center gap-3 cursor-pointer' onClick={() => setOpenUserMenu((prev) => !prev)}>
                    <img
                      src={currentUser.img || "/src/assets/default-user.png"}
                      alt="Profile"
                      className='w-12 h-12 rounded-full object-cover border-2 border-purple-700 p-0.5'
                    />
                    <span className='font-bold text-gray-800'>{currentUser.username}</span>
                  </div>
                  {openUserMenu && <UserMenu />}
                </div>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className='text-white font-bold bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg transition-colors'>
                Join
              </button>
            )}
          </div>
          <div ref={mobileMenuButtonRef} className="md:hidden flex items-center mobile-menu-container">
            <button onClick={() => setOpenMobileMenu(!openMobileMenu)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {openMobileMenu && (
        <div ref={mobileMenuRef} className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li><NavLink to="/gigs" className="font-bold text-lg" onClick={() => setOpenMobileMenu(false)}>Explore</NavLink></li>
            <li><NavLink to="/" className="font-bold text-lg" onClick={() => setOpenMobileMenu(false)}>Home</NavLink></li>
            <li><NavLink to="/contact" className="font-bold text-lg" onClick={() => setOpenMobileMenu(false)}>Contact Us</NavLink></li>
            
            {currentUser ? (
              <>
                <li className="w-full border-t my-2"></li>
                <UserMenu isMobile={true} />
              </>
            ) : (
                <li className="w-full px-4 pt-4 border-t">
                    <button onClick={() => {navigate('/login'); setOpenMobileMenu(false);}} className='w-full text-white font-bold bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg'>
                        Join
                    </button>
                </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;