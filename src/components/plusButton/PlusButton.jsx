import React, { useState } from "react";

const PlusButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="fixed bottom-8 right-8 flex items-center gap-2 z-50">
                {isHovered && (
                    <span className="bg-gray-800 text-white text-sm py-1 px-3 rounded-md whitespace-nowrap shadow-lg">
                        Create Donation
                    </span>
                )}
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)} // ✅ Trigger modal open
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out ${
                isHovered ? "w-14 h-14 text-2xl" : "w-12 h-12 text-xl"
            } flex items-center justify-center`}
            aria-label="Create Donation"
        >
            +
        </button>
        </div>
    );
};

export default PlusButton;