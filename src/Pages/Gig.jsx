import React from 'react'

export const Gig = () => {
  return (
    <div>
        <div id="webcrumbs"> 
        	<div className="flex flex-col lg:flex-row gap-6 p-4 bg-gray-50 min-h-screen">
	  {/* Sidebar Filters */}
	  <div className="w-full lg:w-64 h-fit bg-white rounded-lg shadow-sm p-4 order-2 lg:order-1">
	    <div className="mb-6">
	      <h3 className="font-semibold text-lg mb-3">Filters</h3>
	      <div className="border-b pb-4 mb-4">
	        <h4 className="font-medium mb-3">Budget Range</h4>
	        <div className="flex gap-2 items-center mb-3">
	          <input type="number" placeholder="Min" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-300 focus:outline-none transition" />
	          <span>-</span>
	          <input type="number" placeholder="Max" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-300 focus:outline-none transition" />
	        </div>
	        <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500" />
	      </div>
	      
	      <div className="border-b pb-4 mb-4">
	        <h4 className="font-medium mb-3">Delivery Time</h4>
	        <div className="space-y-2">
	          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
	            <input type="checkbox" className="rounded text-primary-500 focus:ring-primary-300" />
	            <span>24 Hours</span>
	          </label>
	          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
	            <input type="checkbox" className="rounded text-primary-500 focus:ring-primary-300" />
	            <span>Up to 3 Days</span>
	          </label>
	          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
	            <input type="checkbox" className="rounded text-primary-500 focus:ring-primary-300" />
	            <span>Up to 7 Days</span>
	          </label>
	        </div>
	      </div>
	      
	      <div className="mb-4">
	        <h4 className="font-medium mb-3">Seller Level</h4>
	        <div className="space-y-2">
	          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
	            <input type="checkbox" className="rounded text-primary-500 focus:ring-primary-300" />
	            <span>New Seller</span>
	          </label>
	          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
	            <input type="checkbox" className="rounded text-primary-500 focus:ring-primary-300" />
	            <span>Level 1</span>
	          </label>
	          <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition">
	            <input type="checkbox" className="rounded text-primary-500 focus:ring-primary-300" />
	            <span>Top Rated</span>
	          </label>
	        </div>
	      </div>
	      
	      <div className="flex gap-2">
	        <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition flex-1">Apply</button>
	        <button className="bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition flex-1">Reset</button>
	      </div>
	    </div>
	  </div>
	  
	  {/* Main Content */}
	  <div className="flex-1 order-1 lg:order-2">
	    {/* Search Bar */}
	    <div className="sticky top-0 bg-white shadow-sm rounded-lg mb-6 p-4 z-10">
	      <div className="relative">
	        <input 
	          type="text" 
	          placeholder="Search for services..." 
	          className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition"
	        />
	        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
	      </div>
	    </div>
	    
	    {/* Category Title and Sort */}
	    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
	      <h1 className="text-2xl font-bold mb-2 md:mb-0">Graphic Design Services</h1>
	      
	      <details className="relative">
	        <summary className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50 transition">
	          <span>Sort by: Best Match</span>
	          <span className="material-symbols-outlined text-sm">expand_more</span>
	        </summary>
	        <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg overflow-hidden z-20 w-48 border">
	          <ul>
	            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer font-medium text-primary-500">Best Match</li>
	            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Newest</li>
	            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Price: Low to High</li>
	            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Price: High to Low</li>
	          </ul>
	        </div>
	      </details>
	    </div>
	    
	    {/* Gig Card Grid */}
	    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	      {/* Gig Card 1 */}
	      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
	        <div className="relative">
	          <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7" alt="Graphic design work" className="w-full h-48 object-cover" keywords="graphic design, logo design, branding" />
	          <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
	            <span className="material-symbols-outlined text-rose-500">favorite_border</span>
	          </div>
	        </div>
	        <div className="p-4">
	          <div className="flex items-center gap-2 mb-3">
	            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxzZWxsZXJ8ZW58MHx8fHwxNzUzMzQ4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Seller" className="w-8 h-8 rounded-full object-cover" />
	            <span className="font-medium">Jessica W.</span>
	          </div>
	          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-500 transition cursor-pointer">I will create a professional logo design for your business</h3>
	          <div className="flex items-center gap-1 text-sm mb-3">
	            <span className="text-amber-400">★</span>
	            <span>4.9</span>
	            <span className="text-gray-500">(128)</span>
	          </div>
	          <div className="border-t pt-3 flex justify-between items-center">
	            <div className="text-xs text-gray-500">Starting at</div>
	            <div className="font-bold text-lg">$50</div>
	          </div>
	        </div>
	      </div>
	      
	      {/* Gig Card 2 */}
	      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
	        <div className="relative">
	          <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d" alt="Social media design" className="w-full h-48 object-cover" keywords="social media, graphic design, instagram post" />
	          <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
	            <span className="material-symbols-outlined text-rose-500">favorite_border</span>
	          </div>
	        </div>
	        <div className="p-4">
	          <div className="flex items-center gap-2 mb-3">
	            <img src="https://images.unsplash.com/photo-1556741533-974f8e62a92d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwyfHxzZWxsZXJ8ZW58MHx8fHwxNzUzMzQ4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Seller" className="w-8 h-8 rounded-full object-cover" />
	            <span className="font-medium">Michael T.</span>
	          </div>
	          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-500 transition cursor-pointer">I will design eye-catching social media graphics for your brand</h3>
	          <div className="flex items-center gap-1 text-sm mb-3">
	            <span className="text-amber-400">★</span>
	            <span>4.8</span>
	            <span className="text-gray-500">(95)</span>
	          </div>
	          <div className="border-t pt-3 flex justify-between items-center">
	            <div className="text-xs text-gray-500">Starting at</div>
	            <div className="font-bold text-lg">$35</div>
	          </div>
	        </div>
	      </div>
	      
	      {/* Gig Card 3 */}
	      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
	        <div className="relative">
	          <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5" alt="Website design" className="w-full h-48 object-cover" keywords="website design, web development, UI design" />
	          <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
	            <span className="material-symbols-outlined text-rose-500">favorite_border</span>
	          </div>
	        </div>
	        <div className="p-4">
	          <div className="flex items-center gap-2 mb-3">
	            <img src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwzfHxzZWxsZXJ8ZW58MHx8fHwxNzUzMzQ4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Seller" className="w-8 h-8 rounded-full object-cover" />
	            <span className="font-medium">Sarah L.</span>
	          </div>
	          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-500 transition cursor-pointer">I will design a modern and responsive website UI</h3>
	          <div className="flex items-center gap-1 text-sm mb-3">
	            <span className="text-amber-400">★</span>
	            <span>5.0</span>
	            <span className="text-gray-500">(42)</span>
	          </div>
	          <div className="border-t pt-3 flex justify-between items-center">
	            <div className="text-xs text-gray-500">Starting at</div>
	            <div className="font-bold text-lg">$120</div>
	          </div>
	        </div>
	      </div>
	      
	      {/* Gig Card 4 */}
	      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
	        <div className="relative">
	          <img src="https://images.unsplash.com/photo-1618004912476-29818d81ae2e" alt="Illustration art" className="w-full h-48 object-cover" keywords="illustration, digital art, character design" />
	          <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
	            <span className="material-symbols-outlined text-rose-500">favorite_border</span>
	          </div>
	        </div>
	        <div className="p-4">
	          <div className="flex items-center gap-2 mb-3">
	            <img src="https://images.unsplash.com/photo-1534683251650-3fd64cd1561a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHw0fHxzZWxsZXJ8ZW58MHx8fHwxNzUzMzQ4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Seller" className="w-8 h-8 rounded-full object-cover" />
	            <span className="font-medium">Alex K.</span>
	          </div>
	          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-500 transition cursor-pointer">I will create custom digital illustrations and character designs</h3>
	          <div className="flex items-center gap-1 text-sm mb-3">
	            <span className="text-amber-400">★</span>
	            <span>4.7</span>
	            <span className="text-gray-500">(84)</span>
	          </div>
	          <div className="border-t pt-3 flex justify-between items-center">
	            <div className="text-xs text-gray-500">Starting at</div>
	            <div className="font-bold text-lg">$75</div>
	          </div>
	        </div>
	      </div>
	      
	      {/* Gig Card 5 */}
	      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
	        <div className="relative">
	          <img src="https://images.unsplash.com/photo-1626253934161-08cfea22e968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ258ZW58MHx8fHwxNzUzMzcxMjI5fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Product packaging design" className="w-full h-48 object-cover" keywords="packaging design, product design, label design" />
	          <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
	            <span className="material-symbols-outlined text-rose-500">favorite_border</span>
	          </div>
	        </div>
	        <div className="p-4">
	          <div className="flex items-center gap-2 mb-3">
	            <img src="https://images.unsplash.com/photo-1556745753-b2904692b3cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHw1fHxzZWxsZXJ8ZW58MHx8fHwxNzUzMzQ4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Seller" className="w-8 h-8 rounded-full object-cover" />
	            <span className="font-medium">Emma R.</span>
	          </div>
	          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-500 transition cursor-pointer">I will design packaging and labels for your products</h3>
	          <div className="flex items-center gap-1 text-sm mb-3">
	            <span className="text-amber-400">★</span>
	            <span>4.9</span>
	            <span className="text-gray-500">(112)</span>
	          </div>
	          <div className="border-t pt-3 flex justify-between items-center">
	            <div className="text-xs text-gray-500">Starting at</div>
	            <div className="font-bold text-lg">$65</div>
	          </div>
	        </div>
	      </div>
	      
	      {/* Gig Card 6 */}
	      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
	        <div className="relative">
	          <img src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb" alt="Branding materials" className="w-full h-48 object-cover" keywords="branding, business cards, stationery design" />
	          <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
	            <span className="material-symbols-outlined text-rose-500">favorite_border</span>
	          </div>
	        </div>
	        <div className="p-4">
	          <div className="flex items-center gap-2 mb-3">
	            <img src="https://images.unsplash.com/photo-1599658880436-c61792e70672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHw2fHxzZWxsZXJ8ZW58MHx8fHwxNzUzMzQ4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Seller" className="w-8 h-8 rounded-full object-cover" />
	            <span className="font-medium">David P.</span>
	          </div>
	          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-500 transition cursor-pointer">I will create a complete branding package for your business</h3>
	          <div className="flex items-center gap-1 text-sm mb-3">
	            <span className="text-amber-400">★</span>
	            <span>4.8</span>
	            <span className="text-gray-500">(76)</span>
	          </div>
	          <div className="border-t pt-3 flex justify-between items-center">
	            <div className="text-xs text-gray-500">Starting at</div>
	            <div className="font-bold text-lg">$150</div>
	          </div>
	        </div>
	      </div>
	     
	    </div>
	  </div>
	</div> 
        </div>
    </div>
  )
}
