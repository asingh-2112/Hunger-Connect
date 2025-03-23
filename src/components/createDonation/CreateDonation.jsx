import { useState, useEffect, useMemo, useCallback } from "react";
import { Dialog, DialogBody} from "@material-tailwind/react";
import { addDoc, collection, doc, getDoc,updateDoc, arrayUnion, serverTimestamp} from "firebase/firestore";
import { fireDb } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import FoodPreferenceStep from "./steps/FoodPreferenceStep";
import AddressDetailsStep from "./steps/AddressDetailsStep";
import AdditionalDetailsStep from "./steps/AdditionalDetailsStep";
import MessageStep from "./steps/MessageStep";

// Constants
const FOOD_TYPES = {
    PACKED: "Packed",
    COOKED: "Cooked",
};

const FOOD_PREFERENCES = {
    VEG: "Veg",
    NON_VEG: "Non-Veg",
    BOTH: "Both",
};


const CreateDonation = ({ open, setOpen }) => {

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
      };


    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        foodType: [],
        vegNonVeg: FOOD_PREFERENCES.VEG,
        quantity: "",
        state: "",
        district: "",
        city: "",
        street: "",
        locality: "",
        pincode: "",
        phoneNumber: "",
        alternatePhoneNumber: "",
        date: "",
        time: "",
        message: "",
        status: "Pending",
        donorId: "",
        donorName: "",
        createdAt:serverTimestamp(),
    });

    // Fetch user data on open
    useEffect(() => {
        if (open) {
            const today = new Date().toISOString().split("T")[0];
            setFormData((prev) => ({ ...prev, date: today }));

            const fetchUserData = async () => {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (!storedUser) return;
                try {
                    const userRef = doc(fireDb, "users", storedUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setFormData((prev) => ({
                            ...prev,
                            state: userData.state || "",
                            district: userData.district || "",
                            city: userData.city || "",
                            street: userData.street || "",
                            locality: userData.locality || "",
                            pincode: userData.pinCode || "",
                            phoneNumber: userData.phone || "",
                            alternatePhoneNumber: userData.alternatePhoneNumber || "",
                            donorId: userData.uid,
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        }
    }, [open]);

    // Single handler for all input changes
    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
    
        setFormData((prev) => {
            if (type === "checkbox") {
                return {
                    ...prev,
                    foodType: checked
                        ? [...prev.foodType, value]
                        : prev.foodType.filter((item) => item !== value),
                };
            } else {
                return { ...prev, [name]: value };
            }
        });
    
        // Clear the error for the current field when the user starts typing
        setErrors((prev) => ({ ...prev, [name]: "" }));
    }, []);

    // Validate current step
    const validateStep = useCallback(() => {
        const newErrors = {};
    
        switch (step) {
            case 1:
                // Step 1: Food Preference
                if (!formData.vegNonVeg) {
                    newErrors.vegNonVeg = "Please select a food preference.";
                }
                if (formData.foodType.length === 0) {
                    newErrors.foodType = "Please select at least one food type.";
                }
                if (!formData.quantity) {
                    newErrors.quantity = "Please enter the food quantity.";
                }
                break;
    
            case 2:
                // Step 2: Address Details
                if (!formData.street) {
                    newErrors.street = "Street address is required.";
                }
                if (!formData.locality) {
                    newErrors.locality = "Locality is required.";
                }
                if (!formData.state) {
                    newErrors.state = "State is required.";
                }
                if (!formData.district) {
                    newErrors.district = "District is required.";
                }
                if (!formData.city) {
                    newErrors.city = "City is required.";
                }
                if (!formData.pincode) {
                    newErrors.pincode = "Pincode is required.";
                } else if (!/^\d{6}$/.test(formData.pincode)) {
                    newErrors.pincode = "Pincode must be a 6-digit number.";
                }
                break;
    
            case 3:
                // Step 3: Additional Details
                if (!formData.phoneNumber) {
                    newErrors.phoneNumber = "Phone number is required.";
                } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
                    newErrors.phoneNumber = "Phone number must be 10 digits.";
                }
                if (formData.alternatePhoneNumber && !/^\d{10}$/.test(formData.alternatePhoneNumber)) {
                    newErrors.alternatePhoneNumber = "Alternate phone number must be 10 digits.";
                }
                if (!formData.date) {
                    newErrors.date = "Date is required.";
                }
                if (!formData.time) {
                    newErrors.time = "Time is required.";
                }
                break;
    
            case 4:
                // Step 4: Message
                if (formData.message.length > 100) {
                    newErrors.message = "Message must not exceed 100 characters.";
                }
                break;
    
            default:
                break;
        }
    
        setErrors(newErrors); // Update the errors state
        return Object.keys(newErrors).length === 0; // Return true if no errors
    }, [step, formData]);

    // Navigate to next step
    const handleNextStep = useCallback(() => {
        if (validateStep()) {
            setErrors({}); // Clear errors before moving to the next step
            setStep((prev) => prev + 1);
        }
    }, [validateStep]);
    
    // Navigate to prev step
    const handlePreviousStep = useCallback(() => {
        setErrors({}); // Clear errors before moving to the previous step
        setStep((prev) => prev - 1);
    }, []);

    // Submit form

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!validateStep()) return;
    
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            toast.error("User not found. Please log in again.");
            return;
        }
        console.log(storedUser);
    
        try {
            // Step 1: Add new donation to "donations" collection
            const donationRef = await addDoc(collection(fireDb, "donations"), {
                ...formData,
                donorId: storedUser.uid, // Ensure donorId is saved
                donorName: storedUser.name, // Ensure donorId is saved
            });
    
            // Step 2: Store donation ID inside user's document
            const userRef = doc(fireDb, "users", storedUser.uid);
            await updateDoc(userRef, {
                donationIds: arrayUnion(donationRef.id), // Append new donation ID to user
            });
    
            // Step 3: Store ONLY the latest donation in localStorage (overwrite previous)
            const latestDonation = {
                id: donationRef.id,
                date: formData.date,
                time: formData.time,
                city: formData.city,
                status: "Pending",
            };
    
            localStorage.setItem("latestDonation", JSON.stringify(latestDonation));
    
            toast.success("Donation added successfully!");
            setOpen(false);
            setStep(1);
            setFormData({
                foodType: [],
                vegNonVeg: FOOD_PREFERENCES.VEG,
                quantity: "",
                state: "",
                district: "",
                city: "",
                street: "",
                locality: "",
                pincode: "",
                phoneNumber: "",
                alternatePhoneNumber: "",
                date: "",
                time: "",
                message: "",
                status: "Pending",
                donorId: "",
                donorName:"",
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            toast.error("Failed to add donation. Please try again.");
            console.error("Error saving donation:", error);
        }
    }, [formData, validateStep, setOpen]);
    
    // Memoize district options
    const districtOptions = useMemo(() => {
        return formData.state
            ? statesAndDistricts[formData.state].map((district) => (
                  <option key={district} value={district}>
                      {district}
                  </option>
              ))
            : [];
    }, [formData.state]);

    

    return (
        <Dialog open={open} handler={() => {}} className="backdrop-blur-md bg-opacity-50">
            <DialogBody className="p-6 bg-white rounded-lg shadow-lg">
                <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-gray-600">&times;</button>
                <h2 className="text-xl font-semibold text-center mb-4">Add Donation</h2>
                
                {/* Step 1: Food Preference */}
                {step === 1 && (
                    <FoodPreferenceStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleNextStep={handleNextStep}
                        errors={errors}
                        setErrors={setErrors}
                    />
                )}
    
                {/* Step 2: Address Details */}
                {step === 2 && (
                    <AddressDetailsStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handlePreviousStep={handlePreviousStep}
                        handleNextStep={handleNextStep}
                        districtOptions={districtOptions}
                        errors={errors}
                        setErrors={setErrors}
                    />
                )}
    
                {/* Step 3: Additional Details */}
                {step === 3 && (
                    <AdditionalDetailsStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handlePreviousStep={handlePreviousStep}
                        handleNextStep={handleNextStep}
                        errors={errors}
                        setErrors={setErrors}
                    />
                )}
    
                {/* Step 4: Message */}
                {step === 4 && (
                    <MessageStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handlePreviousStep={handlePreviousStep}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        setErrors={setErrors}
                    />
                )}
            </DialogBody>
        </Dialog>
    );
};

export default CreateDonation;