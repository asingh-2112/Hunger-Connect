import { Button } from "@material-tailwind/react";

const MessageStep = ({
    formData,
    handleInputChange,
    handlePreviousStep,
    handleSubmit,
    errors,
    setErrors,
}) => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-bold text-lg">Message</label>
        <textarea
            name="message"
            value={formData.message || ""}
            onChange={handleInputChange}
            placeholder="Enter your message here..."
            rows="4"
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        ></textarea>
        {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
        <div className="flex gap-4">
            <Button type="button" onClick={handlePreviousStep}>Back</Button>
            <Button type="submit">Submit</Button>
        </div>
    </form>
);

export default MessageStep;