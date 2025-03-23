import React, { useEffect, useState, useContext } from "react";
import Layout from "../../../components/layout/Layout";
import { Button } from "@material-tailwind/react";
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { fireDb } from "../../../firebase/FirebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../../context/data/myContext";
import { FiLogOut, FiPlusCircle, FiTrash2 } from "react-icons/fi"; 
import { FaUserCircle } from "react-icons/fa";
import PlusButton from "../../../components/plusButton/PlusButton";
import CreateDonation from "../../../components/createDonation/CreateDonation";
import { toast } from "react-hot-toast";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Divider, Grid } from "@mui/material";
import { Email, Phone, LocationOn, Event, AccessTime, Fastfood, Inventory2 } from "@mui/icons-material";


function DonorDashboard() {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [userData, setUserData] = useState({ name: "", email: "", donorType: "", donationIds: [] });
    const context = useContext(myContext);
    const { mode } = context;
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [donationDialogOpen, setDonationDialogOpen] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return navigate("/");

        const userRef = doc(fireDb, "users", storedUser.uid);

        // Listen for changes in user's `donationIds`
        const unsubscribeUser = onSnapshot(userRef, (userSnap) => {
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserData({
                    name: userData.name || "Anonymous",
                    email: userData.email || "Not available",
                    donorType: userData.donorType || "Not available",
                    donationIds: userData.donationIds || [],
                });
                // Fetch donations only when `donationIds` change
                fetchDonations(userData.donationIds);
            }
        });

        return () => unsubscribeUser();
    }, [navigate]);

    useEffect(() => {
        const fetchDonations = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser) return;

            try {
                // Fetch all donations based on donationIds from user's Firestore document
                const donationsQuery = query(collection(fireDb, "donations"), where("donorId", "==", storedUser.uid));
                const donationsSnap = await getDocs(donationsQuery);
                const fetchedDonations = donationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Retrieve latest donation from localStorage
                const latestDonation = JSON.parse(localStorage.getItem("latestDonation"));

                // If the latest donation exists and isn't already in the list, add it
                if (latestDonation && !fetchedDonations.some(donation => donation.id === latestDonation.id)) {
                    setDonations(prevDonations => [latestDonation, ...prevDonations]); // Newest donation at top
                } else {
                    setDonations(fetchedDonations);
                }

                setDonations(fetchedDonations);
            } catch (error) {
                console.error("Error fetching donations:", error);
            }
        };

        if (userData.donationIds.length > 0) {
            fetchDonations();
        }
    }, [userData.donationIds]);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const openDeleteDialog = (donation) => {
        setSelectedDonation(donation);
        setConfirmOpen(true);
    };

    const openDonationDialog = async (donation) => {
        setSelectedDonation(donation);
        setDonationDialogOpen(true);
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
            const donationId = selectedDonation.id;
            const userRef = doc(fireDb, "users", storedUser.uid);

            // Step 1: Delete the donation from Firestore
            await deleteDoc(doc(fireDb, "donations", donationId));

            // Step 2: Remove donation ID from the user's `donationIds` array
            await updateDoc(userRef, {
                donationIds: arrayRemove(donationId)
            });

            // Step 3: Remove donation from UI
            setDonations(donations.filter(donation => donation.id !== donationId));

            // Step 4: Remove from localStorage if it's the latest donation
            const latestDonation = JSON.parse(localStorage.getItem("latestDonation"));
            if (latestDonation && latestDonation.id === donationId) {
                localStorage.removeItem("latestDonation");
            }

            toast.success("Donation deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete donation. Please try again.");
            console.error("Error deleting donation:", error);
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
                    
                    <h1 className="font-bold text-2xl">{userData.name}</h1>
                    <h2 className="text-lg">{userData.donorType} (Food Provider)</h2>
                    <p className="text-sm">{userData.email}</p>
                    <p className="text-sm"><strong>Total Donations:</strong> {donations.length}</p>
                    
                    <div className="mt-4 flex gap-4">
                        <Link to={"/createblog"}>
                            <Button className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700">
                                <FiPlusCircle />
                                Create Blog
                            </Button>
                        </Link>
                        <Button onClick={logout} className="flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 bg-red-600 text-white hover:bg-red-700">
                            <FiLogOut />
                            Logout
                        </Button>
                    </div>
                </div>

                <hr className={`my-6 border-2 ${mode === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />

                {/* Donations Table */}
                <div className={`rounded-xl shadow-lg p-4 overflow-hidden
                    ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                    <h2 className="text-xl font-semibold mb-4">Your Donations</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className={`${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <tr>
                                    <th className="px-6 py-3 text-center">S.No</th>
                                    <th className="px-6 py-3 text-center">City</th>
                                    <th className="px-6 py-3 text-center">Date</th>
                                    <th className="px-6 py-3 text-center">Time</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.length > 0 ? (
                                    donations.map((donation, index) => (
                                        <tr key={donation.id} className={`border-b transition-all
                                            ${mode === 'dark' ? 'border-gray-700 bg-gray-900 hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                                            onClick={() => openDonationDialog(donation)}
                                        >
                                            <td className="px-6 py-4 text-center">{index + 1}.</td>
                                            <td className="px-6 py-4 text-center">{donation.city || "N/A"}</td>
                                            <td className="px-6 py-4 text-center">{donation.date || "N/A"}</td>
                                            <td className="px-6 py-4 text-center">{donation.time || "N/A"}</td>
                                            <td className="px-6 py-4 text-center">{donation.status || "Pending"}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => openDeleteDialog(donation)} className="text-red-600 hover:text-red-800 transition-all" title="Delete Donation">
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

                <PlusButton onClick={() => setOpen(true)} />
                <CreateDonation open={open} setOpen={setOpen} />
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>Are you sure you want to delete this donation?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)}>No</Button>
                        <Button onClick={handleDeleteDonation} className="bg-red-600 text-white">Yes</Button>
                    </DialogActions>
                </Dialog>

                {/* Donation Details Dialog */}
                <Dialog open={donationDialogOpen} onClose={() => setDonationDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>Donation Details</DialogTitle>
                    <DialogContent>
                        {selectedDonation && (
                            <Box sx={{ p: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={6}>
                                        <Typography variant="body1"><LocationOn sx={{ verticalAlign: "middle" }} /> <strong>City:</strong> {selectedDonation.city}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1"><Event sx={{ verticalAlign: "middle" }} /> <strong>Date:</strong> {selectedDonation.date}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1"><AccessTime sx={{ verticalAlign: "middle" }} /> <strong>Time:</strong> {selectedDonation.time}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1"><Fastfood sx={{ verticalAlign: "middle" }} /> <strong>Food Type:</strong> {selectedDonation.foodType?.join(", ")} ({selectedDonation.vegNonVeg})</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1"><Inventory2 sx={{ verticalAlign: "middle" }} /> <strong>Quantity:</strong> {selectedDonation.quantity}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1"><strong>Status:</strong> {selectedDonation.status}</Typography>
                                    </Grid>
                                </Grid>

                                {selectedDonation.status === "Accepted" && selectedDonation.ngoDetails && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>NGO Details</Typography>
                                        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                                            <Grid item xs={12}>
                                                <Typography variant="body1"><strong>Name:</strong> {selectedDonation.ngoDetails.name}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body1"><Email sx={{ verticalAlign: "middle" }} /> <strong>Email:</strong> {selectedDonation.ngoDetails.email}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body1"><Phone sx={{ verticalAlign: "middle" }} /> <strong>Phone:</strong> {selectedDonation.ngoDetails.phone}</Typography>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                        <Button variant="contained" color="primary" onClick={() => setDonationDialogOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

            </div>
        </Layout>
    );
}

export default DonorDashboard;
