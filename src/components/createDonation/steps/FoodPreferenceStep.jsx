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

const FoodPreferenceStep = ({ formData, handleInputChange, handleNextStep }) => (
    <div className="flex flex-col gap-4">
        <h3 className="font-bold text-lg mb-0">Veg/Non-Veg</h3>
        <div className="flex gap-4">
            <label>
                <input
                    type="radio"
                    name="vegNonVeg"
                    value={FOOD_PREFERENCES.VEG}
                    checked={formData.vegNonVeg === FOOD_PREFERENCES.VEG}
                    onChange={handleInputChange}
                />{" "}
                Veg
            </label>
            <label>
                <input
                    type="radio"
                    name="vegNonVeg"
                    value={FOOD_PREFERENCES.NON_VEG}
                    checked={formData.vegNonVeg === FOOD_PREFERENCES.NON_VEG}
                    onChange={handleInputChange}
                />{" "}
                Non-Veg
            </label>
            <label>
                <input
                    type="radio"
                    name="vegNonVeg"
                    value={FOOD_PREFERENCES.BOTH}
                    checked={formData.vegNonVeg === FOOD_PREFERENCES.BOTH}
                    onChange={handleInputChange}
                />{" "}
                Both
            </label>
        </div>
        <h3 className="font-bold text-lg mb-1">Food Type</h3>
        <div className="flex space-x-4">
            <label>
                <input
                    type="checkbox"
                    checked={formData.foodType.includes(FOOD_TYPES.PACKED)}
                    onChange={() =>
                        handleInputChange({
                            target: { name: "foodType", value: FOOD_TYPES.PACKED, type: "checkbox" },
                        })
                    }
                />{" "}
                Packed
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={formData.foodType.includes(FOOD_TYPES.COOKED)}
                    onChange={() =>
                        handleInputChange({
                            target: { name: "foodType", value: FOOD_TYPES.COOKED, type: "checkbox" },
                        })
                    }
                />{" "}
                Cooked
            </label>
        </div>
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
        <Button onClick={handleNextStep}>Next</Button>
    </div>
);

export default FoodPreferenceStep;