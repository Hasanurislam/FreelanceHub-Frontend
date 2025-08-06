import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import newRequest from '../utils/newRequest';
import toast, { Toaster } from 'react-hot-toast';

const BecomeSeller = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        desc: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This endpoint will update the user's isSeller status
            await newRequest.put("/users/become-seller", formData);
            toast.success("Congratulations! You are now a seller.");
            
            // Update user in local storage
            const user = JSON.parse(localStorage.getItem("currentUser"));
            user.isSeller = true;
            localStorage.setItem("currentUser", JSON.stringify(user));

           
            setTimeout(() => {
                navigate("/");
                window.location.reload(); 
            }, 2000);

        } catch (err) {
            console.error("Failed to become a seller:", err);
            toast.error(err.response?.data?.message || "Something went wrong.");
        }
    };

    const benefits = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            title: "Work Your Way",
            description: "Set your own schedule and work from anywhere in the world."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
            title: "Get Paid Securely",
            description: "Our secure payment system ensures you get paid for your work, every time."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
            title: "Build Your Career",
            description: "Gain experience and build a portfolio of work with clients from around the globe."
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" />
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Become a Seller on <span className="text-purple-700">FreelanceHub</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Join our community of talented freelancers and start earning from your skills.
                    </p>
                </div>

                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      
                        <div className="p-8 bg-purple-700 text-white">
                            <h2 className="text-3xl font-bold mb-6">Why Sell With Us?</h2>
                            <ul className="space-y-6">
                                {benefits.map(benefit => (
                                    <li key={benefit.title} className="flex items-start">
                                        <div className="flex-shrink-0 bg-purple-600 rounded-lg p-3">
                                            {benefit.icon}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold">{benefit.title}</h3>
                                            <p className="text-purple-200">{benefit.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Activate Your Seller Profile</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
                                        Tell us about your skills
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="desc"
                                            name="desc"
                                            rows={6}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
                                            placeholder="e.g., I am a full-stack developer with expertise in React and Node.js..."
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                    >
                                        Activate Seller Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeSeller;