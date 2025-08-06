import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IoSearchSharp, IoLogoDesignernews } from "react-icons/io5";
import { CiStar } from "react-icons/ci";
import newRequest from "../utils/newRequest"; // Assuming this is your configured axios instance
import designIcon from '../assets/logo-design-49574.png';
import software from '../assets/software-icon-32076.png';
import marketingLogo from '../assets/marketing-png-1310.png';
import AiLogo from '../assets/ai-icon-12109.png';
import contendWritting from '../assets/marketing-png-1288.png';
import AnimationLogo from '../assets/video-play-icon-11392.png';


// --- Updated Popular Categories with Image Paths ---
const Populer_Categories = [
  { 
    icon: designIcon, 
    title: "Design", 
    query: "design" 
  },
  { 
    icon: software, 
    title: "Software Development", 
    query: "development" 
  },
  { 
    icon: contendWritting, 
    title: "Content Writing", 
    query: "writing" 
  },
  { 
    icon: AiLogo, 
    title: "AI Services", 
    query: "ai" 
  },
  { 
    icon: marketingLogo, 
    title: "Digital Marketing", 
    query: "marketing" 
  },
  { 
    icon: AnimationLogo, 
    title: "Video & Animation", 
    query: "animation" 
  },
];

// --- Helper Component for Gig Cards ---
const GigCard = ({ gig }) => (
    <Link to={`/gig/${gig._id}`} className="block group">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
            <img src={gig.cover} alt={gig.title} className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity" />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-xl mb-3 truncate group-hover:text-purple-700 transition-colors">{gig.title}</h3>
                <div className="mt-auto flex justify-between items-center">
                    <span className="font-extrabold text-2xl text-gray-900">₹{gig.price}</span>
                    <div className="flex items-center">
                        <CiStar className="text-yellow-400 mr-1" size={24}/>
                        <span className="font-bold text-gray-700">{gig.starNumber > 0 ? (gig.totalStars / gig.starNumber).toFixed(1) : 'New'}</span>
                    </div>
                </div>
            </div>
        </div>
    </Link>
);


const Header = () => {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // useQuery to fetch gigs based on the search term
  const { data: gigs, isLoading, error } = useQuery({
    queryKey: ['gigs', searchTerm],
    queryFn: () => newRequest.get(`/gigs?search=${searchTerm.trim()}`).then((res) => res.data),
    enabled: !!searchTerm.trim(), // Only run the query if searchTerm is not empty
  });

  // Fetch featured gigs for the default view
  const { data: featuredGigs, isLoading: isLoadingFeatured } = useQuery({
      queryKey: ['featuredGigs'],
      queryFn: () => newRequest.get(`/gigs?sort=sales&limit=4`).then((res) => res.data), // Example: fetch top 4 best-selling
      enabled: !searchTerm.trim(), // Only run when not searching
  });

  const handleSearch = () => {
    if (input.trim()) {
        // For the main hero search, we navigate to the gigs page
        navigate(`/gigs?search=${input.trim()}`);
    }
  };

  const popularSearches = ["Web Development", "Logo Design", "Content Writing"];

  return (
    <div className="bg-white font-sans text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-purple-100 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Find the Right Talent, <span className="text-purple-600">Right Now</span>
                </h1>
                <p className="text-xl text-gray-600">
                  Browse top freelancers for web development, design, writing, and more.
                </p>
              </div>
              
              <div className="flex bg-white rounded-2xl shadow-lg p-2 max-w-lg mx-auto lg:mx-0">
                <input 
                  type="text" 
                  placeholder="Search for any service..." 
                  className="flex-1 px-6 py-4 border-none outline-none rounded-xl text-lg"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors">
                  <IoSearchSharp size={24} />
                </button>
              </div>

              <div className="flex gap-3 flex-wrap justify-center lg:justify-start items-center">
                <span className="font-semibold text-gray-700">Popular:</span>
                {popularSearches.map(term => (
                    <Link 
                        key={term} 
                        to={`/gigs?search=${encodeURIComponent(term)}`}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all"
                    >
                        {term}
                    </Link>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-64 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                  <IoLogoDesignernews className="text-6xl text-white" />
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Freelancer" className="w-12 h-12 rounded-full object-cover border-2 border-white" />
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-gray-600">Full Stack Developer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <CiStar key={i} className="text-yellow-400" size={20} />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">5.0 (127 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-xl text-gray-600">Explore our most in-demand services</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Populer_Categories.map((category) => (
              <Link to={`/gigs?cat=${category.query}`} key={category.query} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 text-center cursor-pointer">
                <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src={category.icon} alt={category.title} className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900">{category.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Featured Gigs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Top-rated services from our best freelancers, curated for quality and excellence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* ✅ FIX: Added a check to ensure featuredGigs is an array before mapping */}
            {isLoadingFeatured ? (
                <p>Loading...</p>
            ) : Array.isArray(featuredGigs) ? (
                featuredGigs.map((gig) => <GigCard key={gig._id} gig={gig} />)
            ) : (
                <p className="col-span-full text-center">Could not load featured gigs.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">FreelanceHub</h3>
              <p className="text-gray-400">Connecting talented freelancers with amazing opportunities worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Clients</h4>
              <ul className="space-y-2">
                <li><Link to="/gigs" className="hover:text-white transition-colors">Post a Job</Link></li>
                <li><Link to="/gigs" className="hover:text-white transition-colors">Browse Freelancers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Freelancers</h4>
              <ul className="space-y-2">
                <li><Link to="/gigs" className="hover:text-white transition-colors">Find Work</Link></li>
                <li><Link to="/become-seller" className="hover:text-white transition-colors">Become a Seller</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/aboutus" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2025 FreelanceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Header;
