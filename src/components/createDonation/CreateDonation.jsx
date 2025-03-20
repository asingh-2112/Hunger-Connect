import { Fragment, useState, useEffect } from "react";
import { Dialog, DialogBody, Input, Button } from "@material-tailwind/react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { fireDb } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

const CreateDonation = ({ open, setOpen }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        foodType: [],
        vegNonVeg: "Veg",
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
        status: "Pending",
    });

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
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMultiSelect = (value) => {
        setFormData((prev) => {
            const updatedFoodType = prev.foodType.includes(value)
                ? prev.foodType.filter((item) => item !== value)
                : [...prev.foodType, value];
            return { ...prev, foodType: updatedFoodType };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            toast.error("User not found. Please log in again.");
            return;
        }
        try {
            const userRef = doc(fireDb, "users", storedUser.uid);
            await updateDoc(userRef, {
                donations: arrayUnion({ ...formData }),
            });
            toast.success("Donation added successfully!");
            setOpen(false);
            setStep(1);
            setFormData({ foodType: [], vegNonVeg: "Veg",quantity:"", state: "", district: "", city: "", street: "", locality: "", pincode: "", phoneNumber: "", alternatePhoneNumber: "", date: "", time: "", status: "Pending" });
        } catch (error) {
            toast.error("Failed to add donation. Please try again.");
        }
    };

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

    return (
        <Dialog open={open} handler={() => {}} className="backdrop-blur-md bg-opacity-50">
            <DialogBody className="p-6 bg-white rounded-lg shadow-lg">
                <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-gray-600">&times;</button>
                <h2 className="text-xl font-semibold text-center mb-4">Add Donation</h2>
                
                {/* Food Preference */}
                {step === 1 && (
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-lg mb-0">Veg/Non-Veg</h3>
                        <div className="flex gap-4">
                            <label><input type="radio" name="vegNonVeg" value="Veg" checked={formData.vegNonVeg === "Veg"} onChange={handleChange} /> Veg</label>
                            <label><input type="radio" name="vegNonVeg" value="Non-Veg" checked={formData.vegNonVeg === "Non-Veg"} onChange={handleChange} /> Non-Veg</label>
                            <label><input type="radio" name="vegNonVeg" value="Both" checked={formData.vegNonVeg === "Both"} onChange={handleChange} /> Both</label>
                        </div>
                        <h3 className="font-bold text-lg mb-1">Food Type</h3>
                        <div className="flex space-x-4">
                            <label><input type="checkbox" checked={formData.foodType.includes("Packed")} onChange={() => handleMultiSelect("Packed")} /> Packed</label>
                            <label><input type="checkbox" checked={formData.foodType.includes("Cooked")} onChange={() => handleMultiSelect("Cooked")} /> Cooked</label>
                        </div>
                        <h3 className="font-bold text-lg mb-1">Food Quantity (in Kgs)</h3>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <span>Estimate Quantity:</span>
                                <input 
                                    type="number" 
                                    name="packedQuantity" 
                                    value={formData.quantity || ""} 
                                    onChange={handleChange} 
                                    min="1" 
                                    max="100" 
                                    className="w-20 border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </label>
                        </div>
                        <Button onClick={() => setStep(2)}>Next</Button>
                    </div>
                )}

                {/* Address Details */}
                {step === 2 && (
                    <div className="flex flex-col gap-4">
                        <h3 className="font-medium">Step 2: Address Details</h3>
                        <Input name="street" label="Plot No./Street Address" value={formData.street} onChange={handleChange} required />
                        <Input name="locality" label="Locality" value={formData.locality} onChange={handleChange} required />
                        {/* State Dropdown */}
                        <select 
                            name="state" 
                            value={formData.state} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded" 
                            required
                        >
                            <option value="">Select State</option>
                            {Object.keys(statesAndDistricts).map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>

                        {/* District Dropdown - Updates based on selected state */}
                        <select 
                            name="district" 
                            value={formData.district} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded" 
                            disabled={!formData.state} 
                            required
                        >
                            <option value="">Select District</option>
                            {formData.state &&
                                statesAndDistricts[formData.state].map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                        </select>
                        <Input name="city" label="City" value={formData.city} onChange={handleChange} required />
                        <Input name="pincode" label="Pincode" value={formData.pincode} onChange={handleChange} required />
                        <Button onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={() => setStep(3)}>Next</Button>
                    </div>
                )}

                {/* Additional Details */}
                {step === 3 && (
                    <form  className="flex flex-col gap-4">
                        <h3 className="font-medium">Step 3: Date & Time</h3>
                        <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
                        <Input type="time" name="time" value={formData.time} onChange={handleChange} required />
                        <Input type="tel" name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                        <Input type="tel" name="alternatePhoneNumber" label="Alternate Phone Number" value={formData.alternatePhoneNumber} onChange={handleChange} />
                        <Button onClick={() => setStep(2)}>Back</Button>
                        <Button onClick={() => setStep(4)}>Next</Button>
                    </form>
                )}

                {/* Message */}
                {step === 4 && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="font-bold text-lg">Message</label>
                    <textarea
                        name="message"
                        value={formData.message || ""}
                        onChange={handleChange}
                        placeholder="Enter your message here..."
                        rows="4"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    ></textarea>
                    <Button type="button" onClick={() => setStep(3)}>Back</Button>
                    <Button type="submit">Submit</Button>
                </form>
            )}

            </DialogBody>
        </Dialog>
    );
};

export default CreateDonation;
