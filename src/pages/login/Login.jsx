import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { fireDb } from "../../firebase/FirebaseConfig";
// import { auth, db, signInWithEmailAndPassword, getDoc, doc } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(fireDb, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        alert(`Welcome ${userData.role}`);
        // Redirect user based on role
        if (userData.role === "ngo") {
          window.location.href = "/ngo-dashboard";
        } else {
          window.location.href = "/donor-dashboard";
        }
      } else {
        alert("No user data found!");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
