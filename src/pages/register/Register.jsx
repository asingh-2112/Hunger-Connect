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
      "Andhra Pradesh": ["Anantapur","Chittoor","East Godavari","Guntur","Kadapa","Krishna","Kurnool","Prakasam","Nellore","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari"],
      "Arunachal Pradesh": ["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kra Daadi","Kurung Kumey","Lohit","Longding","Lower Dibang Valley","Lower Subansiri","Namsai","Papum Pare","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang","Itanagar"],
      "Assam" : ["Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup Metropolitan","Kamrup (Rural)","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Dima Hasao","Sivasagar","Sonitpur","South Salmara Mankachar","Tinsukia","Udalguri","West Karbi Anglong"],
      "Bihar" : ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
      "Chhattisgarh" : ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Janjgir Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sukma","Surajpur","Surguja"],
      "Goa": ["North Goa", "South Goa"],
      "Gujarat": ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
      "Haryana" : ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Mewat","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
      "Himachal Pradesh" : ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
      "Jammu & Kashmir": ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kargil","Kathua","Kishtwar","Kulgam","Kupwara","Leh","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],
      "Jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum"],
      "Karnataka": ["Bagalkot","Bangalore Rural","Bangalore Urban","Belgaum","Bellary","Bidar","Vijayapura","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Gulbarga","Hassan","Haveri","Kodagu","Kolar","Koppal","Mandya","Mysore","Raichur","Ramanagara","Shimoga","Tumkur","Udupi","Uttara Kannada","Yadgir"],
      "Kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
      "Madhya Pradesh" : ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna",
        "Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],
      "Maharashtra": ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
      "Manipur": ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
      "Meghalaya": ["East Garo Hills","East Jaintia Hills","East Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
      "Mizoram": ["Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip","Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip"],
      "Nagaland": ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"],
      "Odisha": ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Debagarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundergarh"],
      "Punjab": ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Firozpur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Mohali","Muktsar","Pathankot","Patiala","Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran"],
      "Rajasthan": ["Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Dholpur","Dungarpur","Ganganagar","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota","Nagaur","Pali","Pratapgarh","Rajsamand","Sawai Madhopur","Sikar","Sirohi","Tonk","Udaipur"],
      "Sikkim": ["East Sikkim","North Sikkim","South Sikkim","West Sikkim"],
      "Tamil Nadu": ["Ariyalur","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Salem","Sivaganga","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"],
      "Telangana": ["Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial","Jangaon","Jayashankar","Jogulamba","Kamareddy","Karimnagar","Khammam","Komaram Bheem","Mahabubabad","Mahbubnagar","Mancherial","Medak","Medchal","Nagarkurnool","Nalgonda","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Ranga Reddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal Rural","Warangal Urban","Yadadri Bhuvanagiri"],
      "Tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
      "Uttar Pradesh": ["Agra","Aligarh","Allahabad","Ambedkar Nagar","Amethi","Amroha","Auraiya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Faizabad","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
      "Uttarakhand": ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri","Pithoragarh","Rudraprayag","Tehri","Udham Singh Nagar","Uttarkashi"],
      "West Bengal": ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"],
      "Andaman & Nicobar": ["Nicobar","North Middle Andaman","South Andaman"],
      "Chandigarh": ["Chandigarh"],
      "Dadra Haveli":  ["Dadra Nagar Haveli"],
      "Daman Diu": ["Daman","Diu"],
      "Delhi": ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],
      "Lakshadweep": ["Lakshadweep"],
      "Puducherry":["Karaikal","Mahe","Puducherry","Yanam"]
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
