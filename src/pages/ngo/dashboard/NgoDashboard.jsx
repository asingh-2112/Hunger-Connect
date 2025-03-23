import React, { useEffect, useState, useContext } from "react";
import Layout from "../../../components/layout/Layout";
import { Button } from "@material-tailwind/react";
import { doc, onSnapshot, updateDoc, arrayRemove, collection } from "firebase/firestore";
import { fireDb } from "../../../firebase/FirebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../../context/data/myContext";
import { FiLogOut, FiPlusCircle, FiTrash2 } from "react-icons/fi"; 
import { FaUserCircle } from "react-icons/fa";
import PlusButton from "../../../components/plusButton/PlusButton";
import CreateDonation from "../../../components/createDonation/CreateDonation";
import { toast } from "react-hot-toast";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import SearchButton from "../../../components/searchButton/SearchButton";

function NgoDashboard() {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [userData, setUserData] = useState({ organizatioName: "", email: "" ,organizationType: ""});
    const context = useContext(myContext);
    const { mode } = context;
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDonationId, setSelectedDonationId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return navigate("/");

        const userRef = doc(fireDb, "users", storedUser.uid);
        const donationsCollectionRef = collection(fireDb, "donations");

        // Listen for changes in NGO's user data
        const unsubscribeUser = onSnapshot(userRef, (userSnap) => {
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserData({
                    name: userData.organizationName || "Anonymous",
                    email: userData.email || "Not available",
                    organizationType: userData.organizationType || "Not available",
                });
                setDonations(userData.donations || []);
            }
        });

        // Listen for changes in the donations collection (to detect deletions)
        const unsubscribeDonations = onSnapshot(donationsCollectionRef, (snapshot) => {
            setDonations((prevDonations) =>
                prevDonations.filter((donation) =>
                    snapshot.docs.some((doc) => doc.id === donation.id) // Keep only existing donations
                )
            );
        });

        return () => {
            unsubscribeUser();
            unsubscribeDonations();
        };
    }, [navigate]);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Open confirmation dialog and store selected donation ID
    const openWithdrawDialog = (donationId) => {
        setSelectedDonationId(donationId);
        setConfirmOpen(true);
    };

    // Withdraw function
    const handleWithdrawDonation = async () => {
        setConfirmOpen(false);
        if (!selectedDonationId) return;

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            toast.error("User not found. Please log in again.");
            return;
        }

        try {
            
            const donationId= selectedDonationId;
            console.log(selectedDonationId);
            const donationRef = doc(fireDb, "donations", donationId);
            await updateDoc(donationRef, {
                status: "Pending",
                ngoDetails: {}  // ✅ Remove NGO details
            });
            
            const userRef = doc(fireDb, "users", storedUser.uid);
            await updateDoc(userRef, {
                donations: arrayRemove(
                    donations.find((d) => d.id === selectedDonationId)
                ),
            });
            // Remove withdrawn donation from UI
            setDonations((prevDonations) =>
                prevDonations.filter((donation) => donation.id !== selectedDonationId)
            );

            toast.success("Donation withdrawn successfully!");
        } catch (error) {
            toast.error("Failed to withdraw donation. Please try again.");
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

                    <h2 className="text-lg">{userData.organizationType} (Food Distributor)</h2>
                    
                    {/* ✅ Fetch Email from Firestore */}
                    <p className="text-sm">{userData.email}</p>

                    {/* ✅ Display Total Donations Count */}
                    <p className="text-sm">
                        <strong>Total Accepted Donations:</strong> {donations.length}
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
                    <h2 className="text-xl font-semibold mb-4">History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className={`${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <tr>
                                    <th className="px-6 py-3 text-center">S.No</th>
                                    <th className="px-6 py-3 text-center">Donor Name</th>
                                    <th className="px-6 py-3 text-center">City</th>
                                    <th className="px-6 py-3 text-center">Date</th>
                                    <th className="px-6 py-3 text-center">Food Type</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.length > 0 ? (
                                    donations.map((donation, index) => (
                                        <tr key={index} className={`border-b transition-all
                                            ${mode === 'dark' ? 'border-gray-700 bg-gray-900 hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                                        >
                                            <td className="px-6 py-4 text-center">{index + 1}.</td>
                                            <td className="px-6 py-4 text-center">{donation.donorName || "N/A"}</td>
                                            <td className="px-6 py-4 text-center">{donation.city || "N/A"}</td>
                                            <td className="px-6 py-4 text-center">{donation.time || "N/A"}</td>
                                            <td className="px-6 py-4 text-center">{donation.foodType?.join(", ")}</td>
                                            <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => openWithdrawDialog(donation.id)}
                                                className="text-red-600 hover:text-red-800 transition-all"
                                                title="Withdraw Donation"
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
                <SearchButton onClick={() => setOpen(true)} />

                {/* ✅ Create Donation Modal */}
                <CreateDonation open={open} setOpen={setOpen} />

                {/* ✅ Confirmation Dialog */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Withdrawal</DialogTitle>
                <DialogContent>
                    Are you sure you want to withdraw this donation?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>No</Button>
                    <Button onClick={handleWithdrawDonation} className="bg-red-600 text-white">Yes</Button>
                </DialogActions>
            </Dialog>
            </div>
        </Layout>
    );
}

export default NgoDashboard;