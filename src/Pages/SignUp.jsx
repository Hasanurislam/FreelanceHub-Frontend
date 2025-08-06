import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import upload from '../utils/upload';
import newRequest from '../utils/newRequest';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod'; 

//  Define the validation schema using Zod
const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    country: z.string().min(1, "Country is required."),
    img: z.string().optional(),
    isSeller: z.boolean(),
    desc: z.string().optional(),
}).refine(data => !data.isSeller || (data.isSeller && data.desc && data.desc.length > 10), {
    message: "A description of at least 10 characters is required for sellers.",
    path: ["desc"], // This specifies which field the error is for
});


const SignUp = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        img: "",
        country: '',
        isSeller: false,
        desc: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setUser((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSeller = (e) => {
        setUser((prev) => {
            return { ...prev, isSeller: e.target.checked };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ NEW: Validate using the Zod schema
        try {
            userSchema.parse(user);
            setErrors({}); // Clear previous errors if validation is successful
        } catch (err) {
            if (err instanceof z.ZodError) {
                const formattedErrors = {};
                // ✅ FIX: The correct property on a ZodError is 'issues', not 'errors'
                err.issues.forEach(error => {
                    formattedErrors[error.path[0]] = error.message;
                });
                setErrors(formattedErrors);
                toast.error("Please fix the errors before submitting.");
                return;
            }
        }

        let url = "";
        if (file) {
            try {
                url = await upload(file);
            } catch (err) {
                console.log(err);
                toast.error("Image upload failed. Please try again.");
                return;
            }
        }
        
        try {
            await newRequest.post("/auths/register", {
                ...user,
                img: url,
            });
            toast.success("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.log(err);
            // ✅ FIX: Check for the specific duplicate key error from the backend
            if (err.response?.data?.includes('duplicate key')) {
                toast.error("Username or email already exists. Please choose another one.");
            } else {
                toast.error(err.response?.data?.message || "Registration failed.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
            <Toaster position="top-center" />
            <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">
                
                {/* Left Side */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-5 rounded-full filter blur-xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white opacity-5 rounded-full filter blur-xl"></div>
                    <div className="space-y-6 z-10">
                        <h2 className="text-5xl font-extrabold">Join FreelanceHub!</h2>
                        <p className="text-xl opacity-90 font-light">Create your account and unlock new opportunities.</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Create Your Account</h2>
                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        {/* Username */}
                        <div>
                            <input type="text" name="username" placeholder="Username" onChange={handleChange} className={`w-full px-4 py-3.5 border rounded-xl shadow-sm text-lg ${errors.username ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <input type="email" name="email" placeholder="Email" onChange={handleChange} className={`w-full px-4 py-3.5 border rounded-xl shadow-sm text-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <input type="password" name="password" placeholder="Password" onChange={handleChange} className={`w-full px-4 py-3.5 border rounded-xl shadow-sm text-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Country */}
                        <div>
                            <input type="text" name="country" placeholder="Country" onChange={handleChange} className={`w-full px-4 py-3.5 border rounded-xl shadow-sm text-lg ${errors.country ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-gray-600 mb-1">Profile Picture (Optional)</label>
                            <input type="file" name="file" onChange={e => setFile(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>

                        {/* Become a Seller */}
                        <div className="flex items-center gap-3">
                            <input type="checkbox" name="isSeller" onChange={handleSeller} id="isSeller" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                            <label htmlFor="isSeller" className="text-gray-700 text-lg">Become a Seller</label>
                        </div>

                        {/* Description (for sellers) */}
                        {user.isSeller && (
                            <div>
                                <textarea name="desc" rows="4" placeholder="Tell us about your skills..." onChange={handleChange} className={`w-full px-4 py-3.5 border rounded-xl shadow-sm text-lg resize-none ${errors.desc ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                                {errors.desc && <p className="text-red-500 text-sm mt-1">{errors.desc}</p>}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" className="w-full py-4 rounded-xl text-white font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-0.5 cursor-pointer">
                            Sign Up
                        </button>
                    </form>

                    {/* Redirect to Login */}
                    <p className="mt-8 text-center text-gray-700 text-lg">
                        Already have an account?
                        <Link to="/login" className="text-blue-700 hover:text-blue-900 font-semibold ml-2">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
