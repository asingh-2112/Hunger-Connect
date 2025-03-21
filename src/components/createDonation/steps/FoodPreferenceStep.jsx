import { Button } from "@material-tailwind/react";

const FOOD_TYPES = {
    PACKED: "Packed",
    COOKED: "Cooked",
};

const FOOD_PREFERENCES = {
    VEG: "Veg",
    NON_VEG: "Non-Veg",
    BOTH: "Both",
};

const FoodPreferenceStep = ({ formData, handleInputChange, handleNextStep,errors }) => {
    const handleCheckboxChange = (foodType) => {
        const updatedFoodType = formData.foodType.includes(foodType)
            ? formData.foodType.filter((type) => type !== foodType)
            : [...formData.foodType, foodType];

        handleInputChange({ target: { name: "foodType", value: updatedFoodType } });
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg mb-0">Veg/Non-Veg</h3>
            <div className="flex gap-4">
                {Object.values(FOOD_PREFERENCES).map((pref) => (
                    <label key={pref}>
                        <input
                            type="radio"
                            name="vegNonVeg"
                            value={pref}
                            checked={formData.vegNonVeg === pref}
                            onChange={handleInputChange}
                        />{" "}
                        {pref}
                    </label>
                ))}
            </div>
            {errors.vegNonVeg && <p className="text-red-500 text-sm">{errors.vegNonVeg}</p>}
            <h3 className="font-bold text-lg mb-1">Food Type</h3>
            <div className="flex space-x-4">
                {Object.values(FOOD_TYPES).map((type) => (
                    <label key={type}>
                        <input
                            type="checkbox"
                            checked={formData.foodType.includes(type)}
                            onChange={() => handleCheckboxChange(type)}
                        />{" "}
                        {type}
                    </label>
                ))}
            </div>
            {errors.foodType && <p className="text-red-500 text-sm">{errors.foodType}</p>}
            <h3 className="font-bold text-lg mb-1">Food Quantity (in Kgs)</h3>
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <span>Estimate Quantity:</span>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity || ""}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        className="w-20 border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </label>
            </div>
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
            <Button onClick={handleNextStep}>Next</Button>
        </div>
    );
};

export default FoodPreferenceStep;
