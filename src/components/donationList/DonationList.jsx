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

    const acceptDonation = async (e, donationId) => {
        e.stopPropagation();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            toast.error("You must be logged in to accept donations.");
            return;
        }
    
        try {
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
                    name: userData.organizationName || "Unknown NGO",
                    type: userData.organizationType || "Unknown NGO Type",
                    email: storedUser.email,
                    phone: userData.phone || "N/A",
                    ngoId: storedUser.uid,
                }
            });

            await updateDoc(userRef, {
                donations: arrayUnion({
                    id: donationId,
                    donorName: donationData.donorName || "Anonymous",
                    city: donationData.city,
                    date: donationData.date,
                    foodType: donationData.foodType,
                }),
            });

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                    Available Donations
                </h1>
                
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <Input
                            type="text"
                            label="Search by City"
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className=" !bg-white"
                            containerProps={{ className: "min-w-[100px]" }}
                            color="purple"
                        />
                    </div>
                    <div>
                        <Select
                            label="Food Preference"
                            value={foodFilter}
                            onChange={(val) => setFoodFilter(val)}
                            className="!bg-white"
                            color="purple"
                        >
                            <Option value="" className="hover:bg-purple-50">All</Option>
                            <Option value="Veg" className="hover:bg-green-50">Veg</Option>
                            <Option value="Non-Veg" className="hover:bg-red-50">Non-Veg</Option>
                            <Option value="Both" className="hover:bg-yellow-50">Both</Option>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : filteredDonations.length === 0 ? (
                    <div className="text-center py-12 bg-white/70 rounded-lg border border-dashed border-blue-200">
                        <svg className="mx-auto h-16 w-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-800">No donations found</h3>
                        <p className="mt-2 text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
                        <button 
                            onClick={() => {
                                setCityFilter("");
                                setFoodFilter("");
                            }}
                            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white/80 backdrop-blur-sm">
                        <table className="min-w-full divide-y divide-blue-100">
                            <thead className="bg-gradient-to-r from-blue-500 to-purple-500">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        City
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        Food Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        Quantity (Kgs)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-blue-50">
                                {filteredDonations.map((donation) => (
                                    <tr 
                                        key={donation.id} 
                                        className="hover:bg-blue-50/50 cursor-pointer transition-all duration-200"
                                        onClick={() => handleRowClick(donation)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900">{donation.city}</div>
                                                    <div className="text-xs text-blue-600">{donation.date}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {donation.foodType?.join(", ")} 
                                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                    ${donation.vegNonVeg === "Veg" ? 'bg-green-100 text-green-800 border border-green-200' : 
                                                    donation.vegNonVeg === "Non-Veg" ? 'bg-red-100 text-red-800 border border-red-200' : 
                                                    'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                                    {donation.vegNonVeg}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-4 w-4 bg-purple-200 rounded-full mr-2"></div>
                                                <div className="text-sm font-bold text-purple-700">{donation.quantity} kg</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {donation.status === "Pending" ? (
                                                <Button
                                                    onClick={(e) => acceptDonation(e, donation.id)}
                                                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                                    ripple={false}
                                                >
                                                    Accept Donation
                                                </Button>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200">
                                                    <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                                                        <circle cx={4} cy={4} r={3} />
                                                    </svg>
                                                    Accepted
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <DonationDetailDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                selectedDonation={selectedDonation}
            />
        </div>
    );
};

export default DonationList;