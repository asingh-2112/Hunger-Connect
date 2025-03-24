import { Button, Radio, Checkbox, Typography, Input } from "@material-tailwind/react";
const FOOD_TYPES = {
    PACKED: "Packed",
    COOKED: "Cooked",
};

const FOOD_PREFERENCES = {
    VEG: "Veg",
    NON_VEG: "Non-Veg",
    BOTH: "Both",
};
const FoodPreferenceStep = ({ formData, handleInputChange, handleNextStep, errors }) => {
    const handleCheckboxChange = (foodType) => {
        const updatedFoodType = formData.foodType.includes(foodType)
            ? formData.foodType.filter((type) => type !== foodType)
            : [...formData.foodType, foodType];

        handleInputChange({ target: { name: "foodType", value: updatedFoodType } });
    };

    return (
        <div className="space-y-6">
            <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                    Food Preference
                </Typography>
                <div className="flex gap-6">
                    {Object.entries(FOOD_PREFERENCES).map(([key, pref]) => (
                        <Radio
                            key={key}
                            name="vegNonVeg"
                            label={pref}
                            value={pref}
                            checked={formData.vegNonVeg === pref}
                            onChange={handleInputChange}
                            className="border-gray-300"
                        />
                    ))}
                </div>
                {errors.vegNonVeg && (
                    <Typography variant="small" color="red" className="mt-1">
                        {errors.vegNonVeg}
                    </Typography>
                )}
            </div>

            <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                    Food Type
                </Typography>
                <div className="flex gap-6">
                    {Object.entries(FOOD_TYPES).map(([key, type]) => (
                        <Checkbox
                            key={key}
                            label={type}
                            checked={formData.foodType.includes(type)}
                            onChange={() => handleCheckboxChange(type)}
                        />
                    ))}
                </div>
                {errors.foodType && (
                    <Typography variant="small" color="red" className="mt-1">
                        {errors.foodType}
                    </Typography>
                )}
            </div>

            <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                    Food Quantity (in Kgs)
                </Typography>
                <div className="w-1/3">
                    <Input
                        type="number"
                        name="quantity"
                        label="Quantity"
                        value={formData.quantity || ""}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        error={!!errors.quantity}
                    />
                    {errors.quantity && (
                        <Typography variant="small" color="red" className="mt-1">
                            {errors.quantity}
                        </Typography>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleNextStep} color="blue">
                    Next
                </Button>
            </div>
        </div>
    );
};

export default FoodPreferenceStep;