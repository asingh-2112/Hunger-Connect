import React, { useContext, useEffect, useState } from "react";
import myContext from "../../../context/data/myContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDb } from "../../../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin() {
    const context = useContext(myContext);
    const { mode } = context;

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        if (!email || !password) {
            return toast.error("All fields are required");
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const userRef = doc(fireDb, "users", result.user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                toast.success("Login successful");

                // Store user data in localStorage
                localStorage.setItem("user", JSON.stringify({
                    uid: result.user.uid,
                    email: result.user.email,
                    role: userData.role
                }));

                // Redirect based on user role
                if (userData.role === "admin") {
                    navigate('/dashboard');
                } else if (userData.role === "provider") {
                    navigate('/donor-dashboard');
                } else if (userData.role === "distributor") {
                    navigate('/ngo-dashboard');
                } else {
                    toast.error("Invalid role detected!");
                    navigate('/');
                }
            } else {
                toast.error("No user data found!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed");
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                {/* Heading */}
                <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <img 
                        src="https://cdn-icons-png.flaticon.com/128/727/727399.png"
                        alt="Login Icon"
                        className="h-20 w-20"
                    />
                </div>

                {/* Form */}
                <form className="space-y-4">
                    {/* Email Input */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />

                    {/* Login Button */}
                    <button
                        type="button"
                        onClick={login}
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        Login
                    </button>

                    {/* Register Option */}
                    <p className="text-center text-gray-600">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-blue-500 hover:underline"
                        >
                            Register here
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
