import { Fragment, useState, useEffect } from "react";
import { Dialog, DialogBody, Input, Button } from "@material-tailwind/react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { fireDb } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

const CreateDonation = ({ open, setOpen }) => {
    const [formData, setFormData] = useState({
        location: "",
        date: "",
        time: "",
        status: "Pending", // Default status
    });

    useEffect(() => {
        if (open) {
            const today = new Date();
            const minDate = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
            setFormData((prev) => ({ ...prev, date: minDate }));
        }
    }, [open]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle donation submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            toast.error("User not found. Please log in again.");
            return;
        }
    
        try {
            const userRef = doc(fireDb, "users", storedUser.uid);
    
            await updateDoc(userRef, {
                donations: arrayUnion({ ...formData }),
            });
    
            toast.success("Donation added successfully!");
            setOpen(false); // Close modal after submission
            setFormData({ location: "", date: "", time: "", status: "Pending" }); // Reset form
        } catch (error) {
            toast.error("Failed to add donation. Please try again.");
        }
    };

    const today = new Date().toISOString().split("T")[0];
    const maxDate = "2050-12-31";

    return (
        <Dialog open={open} handler={() => setOpen(false)} className="backdrop-blur-md bg-opacity-50">
            <DialogBody className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-center mb-4">Add Donation</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Location */}
                    <Input 
                        type="text" 
                        label="Location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        required 
                    />
                    {/* Date picker */}
                    <Input 
                        type="date" 
                        label="Date" 
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={today}  // Prevents past dates
                        max={maxDate} // Limits the year to 2050
                        required  
                    />
                    {/* Time picker */}
                    <Input 
                        type="time"
                        label="Time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange} // Optional: Allows time selection every 15 minutes
                        required 
                    />
                    <Button type="submit" color="blue" className="w-full">Submit</Button>
                </form>
            </DialogBody>
        </Dialog>
    );
};

export default CreateDonation;
