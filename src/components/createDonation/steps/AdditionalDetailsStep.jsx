import { Button, Input } from "@material-tailwind/react";

const AdditionalDetailsStep = ({
    formData,
    handleInputChange,
    handlePreviousStep,
    handleNextStep,
    errors,
    setErrors,
}) => (
    <div className="flex flex-col gap-4">
        <h3 className="font-medium">Step 3: Additional Details</h3>
        <Input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
        <Input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
        <Input
            type="tel"
            name="phoneNumber"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
        <Input
            type="tel"
            name="alternatePhoneNumber"
            label="Alternate Phone Number"
            value={formData.alternatePhoneNumber}
            onChange={handleInputChange}
        />
        {errors.alternatePhoneNumber && <p className="text-red-500 text-sm">{errors.alternatePhoneNumber}</p>}
        <div className="flex gap-4">
            <Button onClick={handlePreviousStep}>Back</Button>
            <Button onClick={handleNextStep}>Next</Button>
        </div>
    </div>
);

export default AdditionalDetailsStep;