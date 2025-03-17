import React, { useEffect, useState, useContext } from "react";
import Layout from "../../../components/layout/Layout";
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { fireDb } from "../../../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import myContext from "../../../context/data/myContext";
import { FiLogOut, FiPlusCircle } from "react-icons/fi"; 
import { FaPlus, FaUserCircle } from "react-icons/fa";

function DonorDashboard() {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const context = useContext(myContext);
    const { mode } = context;

    useEffect(() => {
        const fetchDonations = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser) return navigate("/");

            const userRef = doc(fireDb, "users", storedUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setDonations(userSnap.data().donations || []);
            }
        };
        fetchDonations();
        window.scrollTo(0, 0);
    }, [navigate]);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <Layout>
            <div className="py-10 px-6 max-w-5xl mx-auto">

                {/* Profile Card */}
                <div className={`rounded-xl shadow-lg p-6 flex flex-col items-center text-center
                    ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`
                }>
                    <FaUserCircle className="text-6xl text-gray-400 mb-4" />
                    <h1 className="font-bold text-2xl">Kamal Nayan Upadhyay</h1>
                    <h2 className="text-lg text-gray-500">Food Provider(Donor): Type</h2>
                    <p className="text-sm text-gray-500">knupadhyay784@gmail.com</p>
                    <p className="text-sm text-gray-500"><strong>Total Blogs:</strong> 15</p>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-4">
                        <Link to={"/createblog"}>
                            <Button 
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg
                                transition-all duration-300
                                bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <FiPlusCircle />
                                Create Blog
                            </Button>
                        </Link>
                        <Button 
                            onClick={logout} 
                            className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg
                            transition-all duration-300
                            bg-red-600 text-white hover:bg-red-700"
                        >
                            <FiLogOut />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Divider Line */}
                <hr className={`my-6 border-2 ${mode === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />

                {/* Donations Table */}
                <div className={`rounded-xl shadow-lg p-4 overflow-hidden
                    ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                    <h2 className="text-xl font-semibold mb-4">Your Donations</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className={`${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <tr>
                                    <th className="px-6 py-3 text-left">S.No</th>
                                    <th className="px-6 py-3 text-left">Donor</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.length > 0 ? (
                                    donations.map((donation, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b transition-all
                                                ${mode === 'dark' 
                                                    ? 'border-gray-700 bg-gray-900 hover:bg-gray-800' 
                                                    : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                                        >
                                            <td className="px-6 py-4">{index + 1}.</td>
                                            <td className="px-6 py-4">{donation.donorName}</td>
                                            <td className="px-6 py-4">{donation.date}</td>
                                            <td className="px-6 py-4">{donation.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className={mode === 'dark' ? 'bg-gray-900' : 'bg-white'}>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No Donations Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Floating Plus Button */}
                <div className="fixed bottom-8 right-8">
                    <button 
                        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg
                        bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                        title="Add Donation"
                    >
                        <FaPlus className="text-2xl" />
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default DonorDashboard;
