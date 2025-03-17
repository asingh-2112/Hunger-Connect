import React from "react";
import { useNavigate } from "react-router-dom";

const PlusButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/createdonation")}
            className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow-lg text-2xl"
            title="Create Donation"
        >
            +
        </button>
    );
};

export default PlusButton;
