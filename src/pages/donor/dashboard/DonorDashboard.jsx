import React, { useEffect, useState, useContext } from "react";
import Layout from "../../../components/layout/Layout";
import { Button } from "@material-tailwind/react";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { fireDb } from "../../../firebase/FirebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../../context/data/myContext";
import { FiLogOut, FiPlusCircle, FiTrash2 } from "react-icons/fi"; 
import { FaUserCircle } from "react-icons/fa";
import PlusButton from "../../../components/plusButton/PlusButton";
import CreateDonation from "../../../components/createDonation/CreateDonation";
import { toast } from "react-hot-toast";
import DonationDetailDialog from "../../../components/donationDetailDialog/DonationDetailDialog";
import { 
  Card, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Chip,
  Avatar,
  Divider
} from "@mui/material";
import { 
  LocationOn, 
  Event, 
  AccessTime, 
  Fastfood,
  Delete,
  Article,
  Scale
} from "@mui/icons-material";

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
        const unsubscribeUser = onSnapshot(userRef, (userSnap) => {
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserData({
                    name: userData.name || "Anonymous",
                    email: userData.email || "Not available",
                    donorType: userData.donorType || "Not available",
                    donationIds: userData.donationIds || [],
                });
                fetchDonations(userData.donationIds);
            }
        });
        return () => unsubscribeUser();
    }, [navigate]);

    const fetchDonations = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return;

        try {
            const donationsQuery = query(
                collection(fireDb, "donations"),
                where("donorId", "==", storedUser.uid),
                orderBy("createdAt", "desc")
            );
            const donationsSnap = await getDocs(donationsQuery);
            let fetchedDonations = donationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const latestDonation = JSON.parse(localStorage.getItem("latestDonation"));
            if (latestDonation && !fetchedDonations.some(donation => donation.id === latestDonation.id)) {
                fetchedDonations = [latestDonation, ...fetchedDonations];
            }
            setDonations(fetchedDonations);
        } catch (error) {
            console.error("Error fetching donations:", error);
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const openDeleteDialog = (e, donation) => {
        e.stopPropagation();
        setSelectedDonation(donation);
        setConfirmOpen(true);
    };

    const openDonationDialog = (donation) => {
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
            await deleteDoc(doc(fireDb, "donations", donationId));
            await updateDoc(userRef, {
                donationIds: arrayRemove(donationId)
            });
            setDonations(donations.filter(donation => donation.id !== donationId));
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

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return 'warning';
            case 'Accepted': return 'success';
            case 'Rejected': return 'error';
            default: return 'default';
        }
    };

    return (
        <Layout>
            <div className="py-8 px-4 max-w-7xl mx-auto" style={{ 
                background: mode === 'dark' ? 
                'radial-gradient(circle at top right, #1e293b, #0f172a)' : 
                'radial-gradient(circle at top right, #f0f9ff, #e0f2fe)'
            }}>
                {/* Profile Section with vibrant colors */}
                <Card className={`p-6 mb-8 rounded-xl shadow-lg ${
                    mode === 'dark' ? 
                    'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 
                    'bg-gradient-to-br from-white to-blue-50 border border-blue-100'
                }`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600">
                            <FaUserCircle className="text-4xl text-white" />
                        </Avatar>
                        <div className="flex-1 text-center md:text-left">
                            <Typography variant="h4" className="font-bold text-gray-800 dark:text-white">
                                {userData.name}
                            </Typography>
                            <Typography variant="subtitle1" className="text-blue-600 dark:text-blue-300">
                                {userData.donorType} Donor
                            </Typography>
                            <Typography variant="body2" className="mt-1 text-gray-600 dark:text-gray-300">
                                {userData.email}
                            </Typography>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/createblog">
                                <Button 
                                    variant="gradient" 
                                    color="blue"
                                    className="flex items-center gap-2 shadow-md"
                                    startIcon={<Article />}
                                >
                                    Create Blog
                                </Button>
                            </Link>
                            <Button 
                                variant="gradient" 
                                color="red" 
                                className="flex items-center gap-2 shadow-md"
                                onClick={logout}
                                startIcon={<FiLogOut />}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                    
                    <Divider className="my-4" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 shadow-sm">
                            <Typography variant="h5" className="font-bold text-blue-800 dark:text-blue-100">
                                {donations.length}
                            </Typography>
                            <Typography variant="body2" className="text-blue-600 dark:text-blue-300">
                                Total Donations
                            </Typography>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 shadow-sm">
                            <Typography variant="h5" className="font-bold text-green-800 dark:text-green-100">
                                {donations.filter(d => d.status === 'Accepted').length}
                            </Typography>
                            <Typography variant="body2" className="text-green-600 dark:text-green-300">
                                Accepted
                            </Typography>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 shadow-sm">
                            <Typography variant="h5" className="font-bold text-yellow-900 dark:text-yellow-100">
                                {donations.filter(d => d.status === 'Pending').length}
                            </Typography>
                            <Typography variant="body2" className="text-yellow-800 dark:text-yellow-300">
                                Pending
                            </Typography>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 shadow-sm">
                            <Typography variant="h5" className="font-bold text-purple-800 dark:text-purple-100">
                                {donations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0)} kg
                            </Typography>
                            <Typography variant="body2" className="text-purple-600 dark:text-purple-300">
                                Total Food
                            </Typography>
                        </div>

                    </div>
                </Card>

                {/* Donations Section with colorful cards */}
                <Card className={`rounded-xl shadow-lg ${
                    mode === 'dark' ? 
                    'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 
                    'bg-gradient-to-br from-white to-blue-50 border border-blue-100'
                }`}>
                    <div className="p-6">
                        <Typography variant="h5" className={`font-bold mb-4 ${
                            mode === 'dark' ? 'text-blue-300' : 'text-blue-600'
                        }`}>
                            Your Donations
                        </Typography>
                        
                        {donations.length === 0 ? (
                            <div className="text-center py-8">
                                <Fastfood className={`text-4xl mx-auto ${
                                    mode === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                } mb-2`} />
                                <Typography variant="h6" className={
                                    mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }>
                                    No donations yet
                                </Typography>
                                <Button 
                                    variant="gradient"
                                    color="blue"
                                    className="mt-4 shadow-md"
                                    onClick={() => setOpen(true)}
                                >
                                    Make your first donation
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {donations.map((donation, index) => (
                                    <Card 
                                        key={donation.id} 
                                        className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                                            mode === 'dark' ? 
                                            'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700' : 
                                            'bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white'
                                        } border-l-4 ${donation.status === 'Accepted' ? 'border-green-500' : 
                                          donation.status === 'Rejected' ? 'border-red-500' : 'border-yellow-500'}`}
                                        onClick={() => openDonationDialog(donation)}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className={`${
                                                    donation.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                    donation.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {index + 1}
                                                </Avatar>
                                                <div>
                                                    <Typography variant="subtitle1" className="font-medium text-gray-800 dark:text-white">
                                                        {donation.city || "N/A"}
                                                    </Typography>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Event fontSize="small" className="text-gray-500 dark:text-gray-400" />
                                                        <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                                                            {donation.date} • {donation.time}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Scale fontSize="small" className="text-blue-500" />
                                                    <Typography variant="body2" className="font-medium text-blue-600 dark:text-blue-300">
                                                        {donation.quantity || "N/A"} kg
                                                    </Typography>
                                                </div>
                                                <Chip 
                                                    label={donation.status || "Pending"} 
                                                    color={getStatusColor(donation.status)}
                                                    size="small"
                                                    className="shadow-sm"
                                                />
                                                <Button 
                                                    variant="gradient"
                                                    color="red"
                                                    size="sm"
                                                    onClick={(e) => openDeleteDialog(e, donation)}
                                                    startIcon={<Delete fontSize="small" />}
                                                    className="shadow-sm"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Modals (keep existing functionality) */}
                <PlusButton onClick={() => setOpen(true)} />
                <CreateDonation open={open} setOpen={setOpen} />
                
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        Confirm Deletion
                    </DialogTitle>
                    <DialogContent>
                        <Typography className="mt-4">
                            Are you sure you want to delete this donation?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setConfirmOpen(false)}
                            variant="outlined"
                            color="gray"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDeleteDonation} 
                            variant="gradient"
                            color="red"
                            className="shadow-md"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <DonationDetailDialog
                    open={donationDialogOpen}
                    onClose={() => setDonationDialogOpen(false)}
                    selectedDonation={selectedDonation}
                />
            </div>
        </Layout>
    );
}

export default DonorDashboard;