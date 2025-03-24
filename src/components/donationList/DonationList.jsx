import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, getDoc, arrayUnion } from "firebase/firestore";
import { fireDb } from "../../firebase/FirebaseConfig";
import { Button, Input, Select, Option } from "@material-tailwind/react";
import toast from "react-hot-toast";
import DonationDetailDialog from "../donationDetailDialog/DonationDetailDialog";

const DonationList = () => {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cityFilter, setCityFilter] = useState("");
    const [foodFilter, setFoodFilter] = useState("");
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchDonations();
    }, []);

    const handleRowClick = (donation) => {
        setSelectedDonation(donation);
        setDialogOpen(true);
    };

    // Fetch all available donations
    const fetchDonations = async () => {
        setLoading(true);
        try {
            const donationsSnap = await getDocs(collection(fireDb, "donations"));
            const fetchedDonations = donationsSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(donation => donation.status === "Pending"); 
            setDonations(fetchedDonations);
            setFilteredDonations(fetchedDonations);
        } catch (error) {
            console.error("Error fetching donations:", error);
            toast.error("Failed to fetch donations!");
        }
        setLoading(false);
    };

    // Apply filters
    useEffect(() => {
        let filtered = donations;

        if (cityFilter) {
            filtered = filtered.filter(donation =>
                donation.city.toLowerCase().includes(cityFilter.toLowerCase())
            );
        }

        if (foodFilter) {
            filtered = filtered.filter(donation => donation.vegNonVeg === foodFilter);
        }

        setFilteredDonations(filtered);
    }, [cityFilter, foodFilter, donations]);

    // Accept a donation
    const acceptDonation = async (e, donationId) => {
        e.stopPropagation();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            toast.error("You must be logged in to accept donations.");
            return;
        }
    
        try {
            // Fetch user details from Firestore
            const userRef = doc(fireDb, "users", storedUser.uid);
            const userSnap = await getDoc(userRef);
    
            if (!userSnap.exists()) {
                toast.error("User details not found!");
                return;
            }
    
            const userData = userSnap.data();
    
            const donationRef = doc(fireDb, "donations", donationId);
            const donationSnap = await getDoc(donationRef);
            if (!donationSnap.exists()) {
                toast.error("Donation not found.");
                return;
            }
            
            const donationData = donationSnap.data();
            await updateDoc(donationRef, {
                status: "Accepted",
                ngoDetails: {
                    name: userData.organizationName || "Unknown NGO",  // Retrieved from Firestore
                    type: userData.organizationType || "Unknown NGO Type",  // Retrieved from Firestore
                    email: storedUser.email,
                    phone: userData.phone || "N/A",  // Retrieved from Firestore
                    ngoId: storedUser.uid,
                }
            });

            // Add accepted donation to NGO's Firestore record
            await updateDoc(userRef, {
                donations: arrayUnion({
                    id: donationId,
                    donorName: donationData.donorName || "Anonymous",
                    city: donationData.city,
                    date: donationData.date,
                    foodType: donationData.foodType,
                }),
            });

            // Remove donation from the displayed list
            setFilteredDonations((prevDonations) =>
                prevDonations.filter((donation) => donation.id !== donationId)
            );
            
            setDonations(prevDonations =>
                prevDonations.map(d => (d.id === donationId ? { ...d, status: "Accepted" } : d))
            );
    
            toast.success("Donation accepted successfully!");
        } catch (error) {
            console.error("Error accepting donation:", error);
            toast.error("Failed to accept donation!");
        }
    };

    return (
        <div>
            {/* ✅ Fixed Filters Row */}
            <div className="flex gap-4 mb-4 pt-4">
                {/* City Filter */}
                <div className="w-1/2 min-w-0 relative">
                <Input
                        type="text"
                        placeholder=" "
                        label="Search by City"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="peer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                    />
                    {/* <label className="absolute left-3 top-2 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 transition-all">
                        Filter by City
                    </label> */}
                </div>

                {/* Food Preference Filter (Fixed Dropdown Alignment) */}
                <div className="w-1/2 min-w-0">
                    <Select
                        label="Food Preference"
                        value={foodFilter}
                        onChange={(val) => setFoodFilter(val)}
                        menuProps={{ className: "absolute w-full left-0 top-full" }} // Fix dropdown alignment
                        className="w-full truncate"
                    >
                        <Option value="">All</Option>
                        <Option value="Veg">Veg</Option>
                        <Option value="Non-Veg">Non-Veg</Option>
                        <Option value="Both">Both</Option>
                    </Select>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading donations...</p>
            ) : filteredDonations.length === 0 ? (
                <p className="text-center text-gray-500">No donations found.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-center">City</th>
                            <th className="px-4 py-2 text-center">Food Type</th>
                            <th className="px-4 py-2 text-center">Estimated Qt.(Kgs)</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDonations.map((donation) => (
                            <tr key={donation.id} 
                                className="border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleRowClick(donation)}
                            >
                                <td className="px-4 py-2 text-center">{donation.city}</td>
                                <td className="px-4 py-2 text-center">{donation.foodType?.join(", ")} ({donation.vegNonVeg})</td>
                                <td className="px-4 py-2 text-center">{donation.quantity}</td>
                                {/* <td className="px-4 py-2 text-center">
                                    <span className={px-3 py-1 rounded-full text-sm font-semibold
                                        ${donation.status === "Pending" ? "bg-yellow-200 text-yellow-800" :
                                        donation.status === "Accepted" ? "bg-green-200 text-green-800" :
                                        "bg-gray-200 text-gray-800"}}>
                                        {donation.status}
                                    </span>
                                </td> */}
                                <td className="px-4 py-2 text-center">
                                    {donation.status === "Pending" ? (
                                        <Button
                                            onClick={(e) => acceptDonation(e,donation.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </Button>
                                    ) : (
                                        <span className="text-gray-500">Accepted</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Donation Detail Dialog */}
            <DonationDetailDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                selectedDonation={selectedDonation}
            />
        </div>
    );
};

export default DonationList;