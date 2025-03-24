import { Button, Input, Typography } from "@material-tailwind/react";

const AdditionalDetailsStep = ({
    formData,
    handleInputChange,
    handlePreviousStep,
    handleNextStep,
    errors,
}) => (
    <div className="space-y-4">
        <Typography variant="h5" color="blue-gray" className="mb-4">
            Contact Information
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Input
                    type="date"
                    name="date"
                    label="Pickup Date"
                    value={formData.date}
                    onChange={handleInputChange}
                    error={!!errors.date}
                />
                {errors.date && (
                        <Typography variant="small" color="red" className="mt-1">
                            {errors.date}
                        </Typography>
                    )}
            </div>
            <div>
                <Input
                    type="time"
                    name="time"
                    label="Pickup Time"
                    value={formData.time}
                    onChange={handleInputChange}
                    error={!!errors.time}
                />
                {errors.time && (
                        <Typography variant="small" color="red" className="mt-1">
                            {errors.time}
                        </Typography>
                    )}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Input
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                />
                {errors.email && (
                    <Typography variant="small" color="red" className="mt-1">
                        {errors.email}
                    </Typography>
                )}
            </div>
            
            <div>
                <Input
                    type="tel"
                    name="phoneNumber"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                    <Typography variant="small" color="red" className="mt-1">
                        {errors.phoneNumber}
                    </Typography>
                )}
            </div>
        </div>

        <Input
            type="tel"
            name="alternatePhoneNumber"
            label="Alternate Phone Number (Optional)"
            value={formData.alternatePhoneNumber}
            onChange={handleInputChange}
            error={!!errors.alternatePhoneNumber}
        />
        {errors.alternatePhoneNumber && (
            <Typography variant="small" color="red" className="mt-1">
                {errors.alternatePhoneNumber}
            </Typography>
        )}

        <div className="flex justify-between pt-4">
            <Button variant="outlined" onClick={handlePreviousStep}>
                Back
            </Button>
            <Button onClick={handleNextStep} color="blue">
                Next
            </Button>
        </div>
    </div>
);

export default AdditionalDetailsStep;