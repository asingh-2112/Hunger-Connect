import React, { useContext, useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import myContext from "../../../context/data/myContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDb } from "../../../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
// import { auth, db, doc, fireDb, getDoc } from "../../../firebase/FirebaseConfig";

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
                } else if (userData.role === "donor") {
                    navigate('/donor-dashboard');
                } else if (userData.role === "ngo") {
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
        <div className="flex justify-center items-center h-screen">
            {/* Card */}
            <Card
                className="w-full max-w-[24rem]"
                style={{
                    background: mode === 'dark'
                        ? 'rgb(30, 41, 59)'
                        : 'rgb(226, 232, 240)'
                }}
            >
                {/* Card Header */}
                <CardHeader
                    color="blue"
                    floated={false}
                    shadow={false}
                    className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                    style={{
                        background: mode === 'dark'
                            ? 'rgb(226, 232, 240)'
                            : 'rgb(30, 41, 59)'
                    }}
                >
                    <div className="mb-4 rounded-full border border-white/10 bg-white/10 p-2 text-white">
                        <div className="flex justify-center">
                            {/* Image */}
                            <img src="https://cdn-icons-png.flaticon.com/128/727/727399.png" className="h-20 w-20" alt="Login Icon" />
                        </div>
                    </div>

                    {/* Heading */}
                    <Typography variant="h4" style={{
                        color: mode === 'dark'
                            ? 'rgb(30, 41, 59)'
                            : 'rgb(226, 232, 240)'
                    }}>
                        Login
                    </Typography>
                </CardHeader>

                {/* Card Body */}
                <CardBody>
                    <form className="flex flex-col gap-4">
                        {/* Email Input */}
                        <Input
                            type="email"
                            label="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        {/* Password Input */}
                        <Input
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        
                        {/* Login Button */}
                        <Button
                            onClick={login}
                            style={{
                                background: mode === 'dark'
                                    ? 'rgb(226, 232, 240)'
                                    : 'rgb(30, 41, 59)',
                                color: mode === 'dark'
                                    ? 'rgb(30, 41, 59)'
                                    : 'rgb(226, 232, 240)'
                            }}
                        >
                            Login
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
