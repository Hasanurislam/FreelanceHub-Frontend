import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import newRequest from "../utils/newRequest";

// Main App component for the Sign-Up page
const Login = () => {
    // This useEffect hook is used to initialize Lucide icons after the component mounts.
 
    const navigate=useNavigate();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [Error, setError] = useState(null);
    
    const handleSubmit= async(e)=>{
        e.preventDefault()
        try{

        
        const res =await newRequest.post("/auths/login",
            {username:name,
            password,
            }
        )
        localStorage.setItem("currentUser",JSON.stringify(res.data));
        navigate('/')
    }
    catch(err){
        setError(err.response.data);
        
    }
    }

    console.log(name)
    return (
        // Main container for the sign-up page, centered vertically and horizontally
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Outer card container with softer, more diffused shadows and rounded corners */}
            <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full transform transition-all duration-300 hover:scale-[1.01]">

                {/* Left Column: Welcome Message (Text-only) */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-10 text-white text-center relative overflow-hidden rounded-l-2xl">
                    {/* Abstract shapes for a modern touch */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-5 rounded-full filter blur-xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white opacity-5 rounded-full filter blur-xl"></div>

                    <div className="space-y-6 z-10">
                        <h2 className="text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                            Your Skills, Your Freedom.
                        </h2>
                        <p className="text-xl opacity-90 leading-relaxed font-light">
                            Join SkillHub to discover endless opportunities, collaborate with top clients, and build the freelance career you've always dreamed of.
                        </p>
                        <p className="text-lg opacity-80 mt-4">
                            Start earning on your terms today.
                        </p>
                    </div>
                </div>

                {/* Right Column: Sign-Up Form */}
                <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Create Your FreelanceHub Account</h2>

                    <form onSubmit={handleSubmit}
                     className="space-y-7">
                        {/* Full Name Field */}
                        <div>
                            <label htmlFor="fullName" className="sr-only">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                    <i data-lucide="user" className="h-5 w-5 text-gray-500"></i>
                                </span>
                                <input
                                onChange={(e)=>setName(e.target.value)}
                                    type="text"
                                    name="username"
                                    value={name}
                                    placeholder="Username"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-300 focus:border-blue-500 outline-none transition duration-300 ease-in-out shadow-sm text-lg"
                                    aria-label="Full Name"
                                    required
                                />
                            </div>
                        </div>

                        
                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                    <i data-lucide="lock" className="h-5 w-5 text-gray-500"></i>
                                </span>
                                <input
                                    onChange={(e)=>setPassword(e.target.value)}
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    placeholder="Password"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-300 focus:border-blue-500 outline-none transition duration-300 ease-in-out shadow-sm text-lg"
                                    aria-label="Password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl text-white font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                        >
                            Login
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-gray-700 text-lg">
                        Already have an account?
                        <a onClick={()=>navigate('/signup')} className="text-blue-700 hover:text-blue-900 font-semibold ml-2 transition duration-200 ease-in-out cursor-pointer">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
