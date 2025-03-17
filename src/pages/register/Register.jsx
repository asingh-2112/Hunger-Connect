import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, fireDb } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth/cordova";
// import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from "../firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor"); // Default role

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(fireDb, "users", userCredential.user.uid), { email, role });
      alert("User registered successfully!");
    } catch (error) {
      console.error("Error registering:", error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="donor">Donor</option>
        <option value="ngo">NGO</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
