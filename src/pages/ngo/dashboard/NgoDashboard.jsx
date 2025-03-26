import React, { useEffect, useState, useContext } from "react";
import Layout from "../../../components/layout/Layout";
import { Button } from "@material-tailwind/react";
import { doc, onSnapshot, updateDoc, arrayRemove, collection, getDoc } from "firebase/firestore";
import { fireDb } from "../../../firebase/FirebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../../context/data/myContext"; 
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import SearchButton from "../../../components/searchButton/SearchButton";
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
  Divider,
  Badge
} from "@mui/material";
import { 
  LocationOn, 
  Event, 
  Fastfood,
  Delete,
  Article,
  People,
  Scale
} from "@mui/icons-material";
import DonationList from "../../../components/donationList/DonationList";

function NgoDashboard() {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [userData, setUserData] = useState({ name: "", email: "", organizationType: "" });
    const context = useContext(myContext);
    const { mode } = context;
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDonationId, setSelectedDonationId] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return navigate("/");

        const userRef = doc(fireDb, "users", storedUser.uid);
        const donationsCollectionRef = collection(fireDb, "donations");

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

        const unsubscribeDonations = onSnapshot(donationsCollectionRef, (snapshot) => {
            setDonations((prevDonations) =>
                prevDonations.filter((donation) =>
                    snapshot.docs.some((doc) => doc.id === donation.id)
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

    const openWithdrawDialog = (donationId, e) => {
        e.stopPropagation();
        setSelectedDonationId(donationId);
        setConfirmOpen(true);
    };

    const openDetailDialog = async (donation) => {
        try {
            const donationRef = doc(fireDb, "donations", donation.id);
            const donationSnap = await getDoc(donationRef);
            
            if (donationSnap.exists()) {
                setSelectedDonation({ id: donationSnap.id, ...donationSnap.data() });
            } else {
                setSelectedDonation(donation);
            }
            setDetailDialogOpen(true);
        } catch (error) {
            console.error("Error fetching donation details:", error);
            toast.error("Failed to load donation details");
            setSelectedDonation(donation);
            setDetailDialogOpen(true);
        }
    };

    const handleWithdrawDonation = async () => {
        setConfirmOpen(false);
        if (!selectedDonationId) return;

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            toast.error("User not found. Please log in again.");
            return;
        }

        try {
            const donationId = selectedDonationId;
            const donationRef = doc(fireDb, "donations", donationId);
            await updateDoc(donationRef, {
                status: "Pending",
                ngoDetails: {}
            });
            
            const userRef = doc(fireDb, "users", storedUser.uid);
            await updateDoc(userRef, {
                donations: arrayRemove(
                    donations.find((d) => d.id === selectedDonationId)
                ),
            });
            
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
            <div className="py-8 px-4 max-w-full mx-auto  ">
                {/* Profile Section with vibrant colors */}
                <Card 
                sx={{
                    backgroundColor: mode === 'dark' ? '#14532d' : '#e0e0e0',
                    
                }}
                className={`p-6 mb-8 rounded-xl shadow-sm bg-gradient-to-r from-teal-50 to-green-50 ${
                    mode === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 
                    'bg-gradient-to-br from-white to-blue-50 border border-blue-100'
                }`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <Avatar className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500">N</Avatar>
                            }
                        >
                            <Avatar className="w-20 h-20 bg-gradient-to-r from-teal-500 to-green-600">
                                <FaUserCircle className="text-4xl text-white" />
                            </Avatar>
                        </Badge>
                        <div className="flex-1 text-center md:text-left">
                            <Typography variant="h4" className="font-bold text-black-800 dark:text-white">
                                {userData.name}
                            </Typography>
                            <Typography variant="subtitle1" className="text-teal-600 dark:text-teal-300">
                                {userData.organizationType} Organization
                            </Typography>
                            <Typography variant="body2" className="mt-1 text-gray-800 dark:text-gray-300">
                                {userData.email}
                            </Typography>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/createblog">
                                <Button 
                                    variant="gradient" 
                                    color="teal"
                                    className="flex items-center gap-2 shadow-md"
                                    startIcon={<Article />}
                                >
                                    Create Blog
                                </Button>
                            </Link>
                            <Button 
                                variant="gradient" 
                                color="red" 
                                className="flex justify-center items-center gap-2 w-full shadow-md"
                                onClick={logout}
                            >
                                <span className="text-center w-full">Logout</span>
                            </Button>

                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 shadow-sm">
                            <Typography variant="h5" className="font-bold text-blue-800 dark:text-blue-100">
                                {donations.length}
                            </Typography>
                            <Typography variant="body2" className="text-blue-600 dark:text-blue-300">
                                Active Donations
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
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 shadow-sm">
                            <Typography variant="h5" className="font-bold text-purple-800 dark:text-purple-100">
                                {donations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0)} kg
                            </Typography>
                            <Typography variant="body2" className="text-purple-600 dark:text-purple-300">
                                Total Food
                            </Typography>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 shadow-sm">
                            <Typography variant="h5" className="font-bold text-orange-800 dark:text-orange-100">
                                {new Set(donations.map(d => d.donorId)).size}
                            </Typography>
                            <Typography variant="body2" className="text-orange-600 dark:text-orange-300">
                                Unique Donors
                            </Typography>
                        </div>
                    </div>
                </Card>

                {/* Donations Section with colorful cards */}
                <Card className={`rounded-xl shadow-lg max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 ${
                    mode === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 
                    'bg-gradient-to-br from-white to-blue-50 border border-blue-100'
                }`}>
                    <div className="p-6 bg-gray-300">
                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
                                Accepted Donations
                            </Typography>
                            <SearchButton onClick={() => setOpen(true)} />
                        </div>
                        
                        {donations.length === 0 ? (
                            <div className="text-center py-8">
                                <Fastfood className="text-4xl mx-auto text-gray-400 mb-2" />
                                <Typography variant="h6" className="text-gray-500 dark:text-gray-400">
                                    No accepted donations yet
                                </Typography>
                                <Button 
                                    variant="gradient"
                                    color="teal"
                                    className="mt-4 shadow-md"
                                    onClick={() => setOpen(true)}
                                >
                                    Search for donations
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {donations.map((donation, index) => (
                                <Card 
                                    key={donation.id}
                                    sx={{
                                        backgroundColor: mode === 'dark' ? '#14532d' : '#fafafa', // Dark green in dark mode, light green in light mode
                                        
                                    }}
                                    className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                                        mode === 'dark' ? 
                                        'bg-gradient-to-r from-gray-700 to-gray-200 hover:from-gray-600 hover:to-gray-700' : 
                                        'bg-gradient-to-r from-white to-gray-50 hover:from-teal-50 hover:to-white'
                                    } border-l-4 border-green-500`}
                                    onClick={() => openDetailDialog(donation)}
                                >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar 
                                                sx={{
                                                    backgroundColor: mode === 'dark' ? '#14532d' : '#388e3c', // Dark green in dark mode, light green in light mode
                                                    color: mode === 'dark' ? '#000000' : '#ffffff', // White in dark mode, light green in light mode
                                                }}
                                                className="bg-green-700 text-green-800">
                                                    {index + 1}
                                                </Avatar>
                                                <div>
                                                    <Typography variant="subtitle1" className="font-medium text-black-800 dark:text-white">
                                                        {donation.donorName || "Anonymous"}
                                                    </Typography>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <LocationOn fontSize="small" className="text-blue-800 dark:text-gray-400" />
                                                        <Typography variant="body2" className="text-gray-800 dark:text-gray-300">
                                                            {donation.city}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center flex-grow">
                                                <Event fontSize="small" className="text-brown-500 mr-2" />
                                                <Typography variant="body2" className="text-black-600">
                                                    {donation.date || 'Date Not Available'}
                                                </Typography>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Scale fontSize="small" className="text-teal-500" />
                                                    <Typography variant="body2" className="font-medium text-teal-600 dark:text-teal-300">
                                                        {donation.quantity || "N/A"} kg
                                                    </Typography>
                                                </div>
                                                <Chip 
                                                    label={donation.foodType?.join(", ") || "Various"} 
                                                    color="primary"
                                                    size="small"
                                                    className="shadow-sm"
                                                />
                                                <Button 
                                                    variant="gradient"
                                                    color="red"
                                                    size="sm"
                                                    onClick={(e) => openWithdrawDialog(donation.id, e)}
                                                    startIcon={<Delete fontSize="small" />}
                                                    className="shadow-sm"
                                                >
                                                    Withdraw
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                
                
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle className="bg-gradient-to-r from-teal-500 to-green-600 text-white">
                        Confirm Withdrawal
                    </DialogTitle>
                    <DialogContent>
                        <Typography className="mt-4">
                            Are you sure you want to withdraw from this donation?
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
                            onClick={handleWithdrawDonation} 
                            variant="gradient"
                            color="red"
                            className="shadow-md"
                        >
                            Withdraw
                        </Button>
                    </DialogActions>
                </Dialog>

                <DonationDetailDialog
                    open={detailDialogOpen}
                    onClose={() => setDetailDialogOpen(false)}
                    selectedDonation={selectedDonation}
                />
            </div>
        </Layout>
    );
}

export default NgoDashboard;