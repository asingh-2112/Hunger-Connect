import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from './pages/home/Home';
import AllBlogs from './pages/allBlogs/AllBlogs';
import Blog from './pages/blog/Blog';
import BlogInfo from './pages/blogInfo/BlogInfo';
import AdminLogin from './pages/admin/adminLogin/AdminLogin';
import Dashboard from './pages/admin/dashboard/Dashboard';
import Nopage from './pages/nopage/Nopage';
import MyState from './context/data/myState';
import { Toaster } from 'react-hot-toast';
import CreateBlog from './pages/admin/createBlog/createBlog';
import DonorDashboard from './pages/donor/dashboard/DonorDashboard';  // Add donor dashboard
import NgoDashboard from './pages/ngo/dashboard/NgoDashboard'; // Add NGO dashboard
import { auth, fireDb } from './firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Register from './pages/register/Register';
import CreateDonation from './components/createDonation/CreateDonation';
// import { auth, db, getDoc, doc } from './firebase'; 

function App() {
  return (
    <div>
      <MyState>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/allblogs" element={<AllBlogs />} />
            <Route path="/bloginfo/:id" element={<BlogInfo />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/register" element={<Register />} />
            <Route path="/createdonation" element={<CreateDonation />} />

            {/* Role-based Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/createblog" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateBlog />
              </ProtectedRoute>
            } />

            {/* Donor Dashboard */}
            <Route path="/donor-dashboard" element={
              <ProtectedRoute allowedRoles={["providor"]}>
                <DonorDashboard />
              </ProtectedRoute>
            } />

            {/* NGO Dashboard */}
            <Route path="/ngo-dashboard" element={
              <ProtectedRoute allowedRoles={["distributor"]}>
                <NgoDashboard />
              </ProtectedRoute>
            } />

            <Route path="/*" element={<Nopage />} />
          </Routes>
          <Toaster />
        </Router>
      </MyState>
    </div>
  );
}

export default App;

/**
 * Role-Based Route Protection
 * - Redirects users to the correct dashboard based on role
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser || JSON.parse(localStorage.getItem("user"));

      if (user?.uid) {
        const userRef = doc(fireDb, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const role = userSnap.data().role;
          setUserRole(role);
          localStorage.setItem("userRole", role); // Store in localStorage for faster access
        }
      }
      setLoading(false);
    };

    checkRole();
  }, []);

  if (loading) return <p>Loading...</p>;
  
  // Redirect unauthorized users
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};
