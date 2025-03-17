import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { auth, fireDb } from "../../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor"); // Default role is donor
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        // Signup logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user role in Firestore
        await setDoc(doc(fireDb, "users", user.uid), { email, role });
        toast.success("Signup successful! Please log in.");
        setIsSignup(false);
      } else {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(fireDb, "users", user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "donor") {
            navigate("/donor-dashboard");
          } else if (role === "ngo") {
            navigate("/ngo-dashboard");
          } else {
            toast.error("Invalid role. Contact support.");
          }
        } else {
          toast.error("User data not found.");
        }
      }
    } catch (error) {
      toast.error("Authentication failed: " + error.message);
    }
  };

  return (
    <div>
      <h2>{isSignup ? "Signup" : "Login"}</h2>
      <form onSubmit={handleAuth}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {isSignup && (
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="donor">Donor</option>
            <option value="ngo">NGO</option>
          </select>
        )}
        <button type="submit">{isSignup ? "Signup" : "Login"}</button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Switch to Login" : "Switch to Signup"}
      </button>
    </div>
  );
};

export default Auth;
