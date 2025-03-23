import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Button } from "@material-tailwind/react";
import DonationList from "../donationList/DonationList";

const SearchButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Floating Search Button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow-lg text-2xl"
                title="Search for Food Donations"
            >
                <FiSearch />
            </button>

            {/* Dialog for Listing Donations */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Available Donations</DialogTitle>
                <DialogContent>
                    <DonationList />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SearchButton;
