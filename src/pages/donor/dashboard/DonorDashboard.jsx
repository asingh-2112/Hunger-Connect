import React, { useEffect, useState, useContext } from "react";
import Layout from "../../../components/layout/Layout";
import { Button } from "@material-tailwind/react";
import { doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { fireDb } from "../../../firebase/FirebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../../context/data/myContext";
import { FiLogOut, FiPlusCircle, FiTrash2 } from "react-icons/fi"; 
import { FaUserCircle } from "react-icons/fa";
import PlusButton from "../../../components/plusButton/PlusButton";
import CreateDonation from "../../../components/createDonation/CreateDonation";
import { toast } from "react-hot-toast";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

function DonorDashboard() {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [userData, setUserData] = useState({ name: "", email: "" ,donorType: ""});
    const context = useContext(myContext);
    const { mode } = context;
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return navigate("/");

        const userRef = doc(fireDb, "users", storedUser.uid);

        const unsubscribe = onSnapshot(userRef, (userSnap) => {
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserData({
                    name: userData.name || "Anonymous",
                    email: userData.email || "Not available",
                    donorType: userData.donorType || "Not available"
                });
                setDonations(userData.donations || []);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const openDeleteDialog = (donation) => {
        setSelectedDonation(donation);
        setConfirmOpen(true);
    };

    const handleDeleteDonation = async () => {
        setConfirmOpen(false);
        if (!selectedDonation) return;

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            toast.error("User not found. Please log in again.");
            return;
        }

        try {
            const userRef = doc(fireDb, "users", storedUser.uid);

            await updateDoc(userRef, {
                donations: arrayRemove(selectedDonation),
            });

            toast.success("Donation deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete donation. Please try again.");
        }
    };

    return (
        <Layout>
            <div className="py-10 px-6 max-w-5xl mx-auto">
                {/* Profile Card */}
                <div className={`rounded-xl shadow-lg p-6 flex flex-col items-center text-center
                    ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                >
                    <FaUserCircle className="text-6xl text-gray-400 mb-4" />
                    
                    {/* ✅ Fetch Name from Firestore */}
                    <h1 className="font-bold text-2xl">{userData.name}</h1>

                    <h2 className="text-lg text-gray-500">{userData.donorType} (Food Provider)</h2>
                    
                    {/* ✅ Fetch Email from Firestore */}
                    <p className="text-sm text-gray-500">{userData.email}</p>

                    {/* ✅ Display Total Donations Count */}
                    <p className="text-sm text-gray-500">
                        <strong>Total Donations:</strong> {donations.length}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-4">
                        <Link to={"/createblog"}>
                            <Button 
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg
                                transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <FiPlusCircle />
                                Create Blog
                            </Button>
                        </Link>
                        <Button 
                            onClick={logout} 
                            className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg
                            transition-all duration-300 bg-red-600 text-white hover:bg-red-700"
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
                                    <th className="px-6 py-3 text-left">City</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Time</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.length > 0 ? (
                                    donations.map((donation, index) => (
                                        <tr key={index} className={`border-b transition-all
                                            ${mode === 'dark' ? 'border-gray-700 bg-gray-900 hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                                        >
                                            <td className="px-6 py-4">{index + 1}.</td>
                                            <td className="px-6 py-4">{donation.city || "N/A"}</td>
                                            <td className="px-6 py-4">{donation.date || "N/A"}</td>
                                            <td className="px-6 py-4">{donation.time || "N/A"}</td>
                                            <td className="px-6 py-4">{donation.status || "Pending"}</td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => openDeleteDialog(donation)}
                                                    className="text-red-600 hover:text-red-800 transition-all"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No Donations Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ✅ Plus Button to Open Modal */}
                <PlusButton onClick={() => setOpen(true)} />

                {/* ✅ Create Donation Modal */}
                <CreateDonation open={open} setOpen={setOpen} />

                {/* ✅ Confirmation Dialog */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this donation?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)}>No</Button>
                        <Button onClick={handleDeleteDonation} className="bg-red-600 text-white">Yes</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Layout>
    );
}

export default DonorDashboard;
