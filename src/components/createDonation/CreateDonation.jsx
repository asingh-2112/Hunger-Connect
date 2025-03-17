import { Fragment, useState } from "react";
import { Dialog, DialogBody, Input, Button } from "@material-tailwind/react";
import { AiOutlinePlus } from "react-icons/ai";

export default function CreateDonation() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        location: "",
        date: "",
        time: "",
    });

    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        setOpen(false); // Close modal after submission
    };

    return (
        <Fragment>
            {/* Open Button */}
            <div onClick={handleOpen} className="cursor-pointer">
                <AiOutlinePlus size={24} color="white" />
            </div>

            {/* Modal */}
            <Dialog 
                open={open} 
                handler={handleOpen} 
                className="backdrop-blur-md bg-opacity-50"
            >
                <DialogBody className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-center mb-4">Add Event</h2>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Location Input */}
                        <Input 
                            type="text" 
                            label="Location" 
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required 
                        />

                        {/* Date Input */}
                        <Input 
                            type="date" 
                            label="Date" 
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required 
                        />

                        {/* Time Input */}
                        <Input 
                            type="time" 
                            label="Time" 
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required 
                        />

                        {/* Submit Button */}
                        <Button type="submit" color="blue" className="w-full">
                            Submit
                        </Button>
                    </form>
                </DialogBody>
            </Dialog>
        </Fragment>
    );
}
