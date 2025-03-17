import React, { useEffect, useState, useContext } from "react";
import Layout from "../../../components/layout/Layout";
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { fireDb } from "../../../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import myContext from '../../../context/data/myContext';
// import { auth, db, getDoc, doc } from "../../../firebase/FirebaseConfig";

function NgoDashboard() {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const context = useContext(myContext);
    const { mode, getAllBlog, deleteBlogs } = context;

    useEffect(() => {
        const fetchDonations = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser) return navigate("/");

            const userRef = doc(fireDb, "users", storedUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setDonations(userSnap.data().donations || []);
            }
        };
        fetchDonations();
        window.scrollTo(0, 0);
    }, [navigate]);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <Layout>
            <div className="py-10">

                <div
                    className="flex flex-wrap justify-start items-center lg:justify-center gap-2 lg:gap-10 px-4 lg:px-0 mb-8">
                    <div className="left">
                        <img
                            className=" w-40 h-40  object-cover rounded-full border-2 border-pink-600 p-1"
                            src={'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'} alt="profile"
                        />
                    </div>
                    <div className="right">
                        <h1
                            className='text-center font-bold text-2xl mb-2'
                            style={{ color: mode === 'dark' ? 'white' : 'black' }}
                        >
                            Kamal Nayan Upadhyay
                        </h1>
                        <h2
                            style={{ color: mode === 'dark' ? 'white' : 'black' }} className="font-semibold">
                            <span>Role : </span>  Food Distributor
                        </h2>
                        <h2
                            style={{ color: mode === 'dark' ? 'white' : 'black' }} className="font-semibold">
                            Software Developer
                        </h2>
                        <h2
                            style={{ color: mode === 'dark' ? 'white' : 'black' }} className="font-semibold">knupadhyay784@gmail.com
                        </h2>
                        <h2
                            style={{ color: mode === 'dark' ? 'white' : 'black' }} className="font-semibold">
                            <span>Total Blog : </span>  15
                        </h2>

                        <div className=" flex gap-2 mt-2">
                            <Link to={'/createblog'}>
                                <div className=" mb-2">
                                    <Button
                                        style={{
                                            background: mode === 'dark'
                                                ? 'rgb(226, 232, 240)'
                                                : 'rgb(30, 41, 59)',
                                            color: mode === 'dark'
                                                ? 'black'
                                                : 'white'
                                        }}
                                        className='px-8 py-2'
                                    >
                                        Create Blog
                                    </Button>
                                </div>
                            </Link>
                            <div className="mb-2">
                                <Button
                                    onClick={logout}
                                    style={{
                                        background: mode === 'dark'
                                            ? 'rgb(226, 232, 240)'
                                            : 'rgb(30, 41, 59)',
                                        color: mode === 'dark'
                                            ? 'black'
                                            : 'white'
                                    }}
                                    className='px-8 py-2'
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Line  */}
                <hr className={`border-2
                 ${mode === 'dark'
                        ? 'border-gray-300'
                        : 'border-gray-400'}`
                }
                />

                {/* Table for Donations */}
                <div className="container mx-auto px-4 max-w-7xl my-5">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-xl">
                        <table
                            className={`w-full border-2 shadow-md text-sm text-left
            ${mode === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                        >
                            <thead
                                className={`text-xs 
                ${mode === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-800'}`}
                            >
                                <tr>
                                    <th className="px-6 py-3">S.No</th>
                                    <th className="px-6 py-3">Donor</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.length > 0 ? (
                                    donations.map((donation, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b
                            ${mode === 'dark' ? 'border-gray-700 bg-gray-900 hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                                        >
                                            <td className="px-6 py-4">{index + 1}.</td>
                                            <td className="px-6 py-4">{donation.donorName}</td>
                                            <td className="px-6 py-4">{donation.date}</td>
                                            <td className="px-6 py-4">{donation.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className={mode === 'dark' ? 'bg-gray-900' : 'bg-white'}>
                                        <td colSpan="4" className="px-6 py-4 text-center">
                                            No Donations Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* Logout Button
                <Button onClick={logout}
                style={{ color: mode === 'dark' ? 'white' : 'black' }} 
                className="px-8 py-2 bg-red-500 text-white text-center">
                    Logout
                </Button> */}
            </div>
        </Layout>
    );
}

export default NgoDashboard;
