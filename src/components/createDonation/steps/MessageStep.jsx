import { Button, Textarea, Typography } from "@material-tailwind/react";

const MessageStep = ({
    formData,
    handleInputChange,
    handlePreviousStep,
    handleSubmit,
    errors,
}) => (
    <div className="space-y-3 md:space-y-4">
        <Typography variant="h5" color="blue-gray" className="mb-4">
            Final Details
        </Typography>

        <Textarea
            name="message"
            label="Additional Message (Optional)"
            value={formData.message || ""}
            onChange={handleInputChange}
            error={!!errors.message}
        />
        {errors.message && (
            <Typography variant="small" color="red" className="mt-1">
                {errors.message}
            </Typography>
        )}

        <div className="flex flex-col md:flex-row justify-between gap-2 pt-4">
            <Button variant="outlined" onClick={handlePreviousStep} className="w-full md:w-auto">
                Back
            </Button>
            <Button onClick={handleSubmit} color="green" className="w-full md:w-auto">
                Submit Donation
            </Button>
        </div>
    </div>
);

export default MessageStep;