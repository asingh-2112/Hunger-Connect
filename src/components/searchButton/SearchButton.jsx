import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Button } from "@material-tailwind/react";
import DonationList from "../donationList/DonationList";

const SearchButton = () => {
    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            {/* Floating Search Button with hover effects */}
            <div className="fixed bottom-8 right-8 flex items-center gap-2 z-50">
                {isHovered && (
                    <span className="bg-gray-800 text-white text-sm py-1 px-3 rounded-md whitespace-nowrap shadow-lg">
                        Search for donations
                    </span>
                )}
                <button
                    onClick={() => setOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out ${
                        isHovered ? "w-14 h-14 text-2xl" : "w-12 h-12 text-xl"
                    } flex items-center justify-center`}
                    aria-label="Search for donations"
                >
                    <FiSearch />
                </button>
            </div>

            {/* Dialog for Listing Donations */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle className="font-semibold text-gray-800">Available Donations</DialogTitle>
                <DialogContent className="p-4">
                    <DonationList />
                </DialogContent>
                <DialogActions className="p-4">
                    <Button 
                        onClick={() => setOpen(false)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SearchButton;