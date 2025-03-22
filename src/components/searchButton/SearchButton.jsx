import React from "react";

const SearchButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick} // ✅ Trigger modal open
            className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow-lg text-2xl"
            title="Search for Food Donations"
        >
            +
        </button>
    );
};

export default SearchButton;