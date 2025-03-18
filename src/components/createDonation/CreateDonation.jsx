import { Fragment, useState, useEffect } from "react";
import { Dialog, DialogBody, Input, Button } from "@material-tailwind/react";
import { AiOutlinePlus } from "react-icons/ai";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { fireDb } from "../../firebase/FirebaseConfig";
import Layout from "../../components/layout/Layout"; // Import Layout

export default function CreateDonation() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        location: "",
        date: "",
        time: "",
        status: "Pending", // Default status for new donations
    });

    useEffect(() => {
        setOpen(true); // Open the dialog when the component mounts
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            alert("User not found. Please log in again.");
            return;
        }

        try {
            // Reference to the user's document in Firestore
            const userRef = doc(fireDb, "users", storedUser.uid);

            // Update donations array by adding the new donation
            await updateDoc(userRef, {
                donations: arrayUnion({
                    location: formData.location,
                    date: formData.date,
                    time: formData.time,
                    status: formData.status,
                }),
            });

            alert("Donation added successfully!");
            setOpen(false); // Close modal after submission
        } catch (error) {
            console.error("Error adding donation:", error);
            alert("Failed to add donation. Please try again.");
        }
    };

    return (
        <Layout>
            <div className="py-10 px-6 max-w-5xl mx-auto">
                {/* Modal */}
                <Dialog open={open} handler={() => setOpen(false)} className="backdrop-blur-md bg-opacity-50">
                    <DialogBody className="p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-center mb-4">Add Donation</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <Input 
                                type="text" 
                                label="Location" 
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required 
                            />

                            <Input 
                                type="date" 
                                label="Date" 
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required 
                            />

                            <Input 
                                type="time" 
                                label="Time" 
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required 
                            />

                            <Button type="submit" color="blue" className="w-full">
                                Submit
                            </Button>
                        </form>
                    </DialogBody>
                </Dialog>
            </div>
        </Layout>
    );
}