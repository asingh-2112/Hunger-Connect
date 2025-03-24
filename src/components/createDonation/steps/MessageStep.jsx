import { Button, Textarea, Typography } from "@material-tailwind/react";

const MessageStep = ({
    formData,
    handleInputChange,
    handlePreviousStep,
    handleSubmit,
    errors,
}) => (
    <div className="space-y-4">
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

        <div className="flex justify-between pt-4">
            <Button variant="outlined" onClick={handlePreviousStep}>
                Back
            </Button>
            <Button onClick={handleSubmit} color="green">
                Submit Donation
            </Button>
        </div>
    </div>
);

export default MessageStep;