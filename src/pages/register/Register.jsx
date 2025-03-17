import React, { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, fireDb } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FaBox, FaTruckLoading } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    donorType: "",
    name: "",
    organizationName: "",
    organizationType: "",
    state: "",
    district: "",
    city: "",
    pinCode: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  
  
  
  const statesAndDistricts = {
      "Andhra Pradesh": ["Anantapur", "Chittoor", "Guntur", "Krishna", "Kurnool"],
      "Delhi": ["Central Delhi", "East Delhi", "New Delhi"],
      "Goa": ["North Goa", "South Goa"],
      "Maharashtra": ["Mumbai City", "Pune", "Nagpur", "Nashik"],
      // Add remaining states & districts...
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
  const nextStep = () => setStep(step + 1);
  const prevStep = () => {
    if (step === 2) {
      setFormData((prevData) => ({
        ...prevData,
        organizationType: "",
        customOrganizationType: "",
        donorType: "",
        customDonorType: ""
      }));
    }
    setStep(step - 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const emailRef = doc(fireDb, "users", formData.email);
    const emailSnap = await getDoc(emailRef);
    if (emailSnap.exists()) {
      setError("Email is already registered");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(fireDb, "users", userCredential.user.uid), { ...formData, role });
      alert("Registration Successful!");
      navigate("/adminlogin"); // Redirect to login page after successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                step >= num ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Step 1: Choose Role */}
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Register As</h2>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => {
                  setRole("provider");
                  nextStep();
                }}
                className="flex flex-col items-center bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition"
              >
                <FaBox size={30} />
                <span className="mt-2">Food Provider</span>
              </button>
              <button
                onClick={() => {
                  setRole("distributor");
                  nextStep();
                }}
                className="flex flex-col items-center bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition"
              >
                <FaTruckLoading size={30} />
                <span className="mt-2">Food Distributor</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {step === 2 && (
          <form className="space-y-4">
            <h2 className="text-xl font-semibold text-center">
              {role === "provider" ? "Food Provider Details" : "Food Distributor Details"}
            </h2>

            {role === "provider" && (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type of Donor</label>
                  <select name="donorType" onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Select</option>
                    <option value="Individual">Individual</option>
                  <option value="Restaurant">Restaurant/Cafe</option>
                  <option value="Corporate">Corporate/Company</option>
                  <option value="Event Organizer">Event Organizer</option>
                  <option value="Other">Others</option>
                  </select>
                </div>

                {/* Show input field if "Other" is selected */}
                {formData.donorType === "Other" && (
                <div className="mb-3">
                    <input
                    type="text"
                    name="customDonorType"
                    placeholder="Enter Donor Type"
                    value={formData.customDonorType} // Controlled input field
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    />
                </div>
                )}

                <div className="mb-3">
                  <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
              </>
            )}

            {role === "distributor" && (
            <>
                <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type of Organization
                </label>
                <select
                    name="organizationType"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select</option>
                    <option value="Child Welfare NGO">Child Welfare NGO</option>
                    <option value="Homeless Shelter">Homeless Shelter</option>
                    <option value="Disaster Relief Organization">Disaster Relief Organization</option>
                    <option value="Community Kitchen">Community Kitchen</option>
                    <option value="Religious/ Faith Based NGO">Religious/ Faith Based NGO</option>
                    <option value="Other">Other</option>
                </select>
                </div>

                {/* Show input field if "Other" is selected */}
                {formData.organizationType === "Other" && (
                <div className="mb-3">
                    <input
                    type="text"
                    name="customOrganizationType"
                    placeholder="Enter Organization Type"
                    value={formData.customOrganizationType} // Controlled input field
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    />
                </div>
                )}

                <div className="mb-3">
                <input
                    type="text"
                    name="organizationName"
                    placeholder="Organization Name"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                </div>
            </>
            )}


            <button type="button" onClick={nextStep} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
              Next
            </button>
          </form>
        )}

        {/* Step 3: Address Details */}
         {/* Step 3: Address Details */}
         {step === 3 && (
            <form className="space-y-4">
                <h2 className="text-xl font-semibold text-center">Address Details</h2>

                {/* State Dropdown */}
                <select name="state" onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select State</option>
                {Object.keys(statesAndDistricts).map((state) => (
                    <option key={state} value={state}>
                    {state}
                    </option>
                ))}
                </select>

                {/* District Dropdown - Updates based on selected state */}
                <select name="district" onChange={handleChange} className="w-full p-2 border rounded" disabled={!formData.state}>
                <option value="">Select District</option>
                {formData.state &&
                    statesAndDistricts[formData.state].map((district) => (
                    <option key={district} value={district}>
                        {district}
                    </option>
                    ))}
                </select>

                <input type="text" name="city" placeholder="City" onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="text" name="pinCode" placeholder="Pin Code" onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded" />

                <button type="button" onClick={nextStep} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                Next
                </button>
            </form>
            )}

        {/* Step 4: Contact & Password */}
        {step === 4 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="password" name="confirmPassword" placeholder="Re-enter Password" onChange={handleChange} className="w-full p-2 border rounded" />
            {error && <p className="text-red-500">{error}</p>}

            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
              Register
            </button>
          </form>
        )}

        {/* Back Button */}
        {step > 1 && <button onClick={prevStep} className="w-full text-gray-500 p-2">Back</button>}

        {/* Login Option */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button onClick={() => navigate('/adminlogin')} className="text-blue-500 hover:underline">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
