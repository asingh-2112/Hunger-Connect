import React, { useContext, useEffect, useState } from "react";
import {
    Navbar,
    Typography,
    IconButton,
    Avatar,
    Collapse,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import myContext from "../../context/data/myContext";
import SearchDialog from "../searchDialog/SearchDialog";
import ShareDialogBox from "../shareDialogBox/ShareDialogBox";

export default function Nav() {
    const [openNav, setOpenNav] = useState(false);
    const context = useContext(myContext);
    const { mode, toggleMode } = context;

    // Fetch user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userRole = storedUser?.role; // Get user role
    const avatarRedirectPath = userRole === "admin"
        ? "/dashboard"
        : userRole === "provider"
        ? "/donor-dashboard"
        : userRole === "distributor"
        ? "/ngo-dashboard"
        : "/reg";

    // Navbar Links
    const navList = (
        <ul className="mb-4 mt-2 flex flex-col gap-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8">
            <Typography as="li" className="p-1 font-normal">
                <Link to={'/'} className="flex items-center text-lg hover:text-blue-500 transition-colors duration-300">
                    Home
                </Link>
            </Typography>
            <Typography as="li" className="p-1 font-normal">
                <Link to={'/allblogs'} className="flex items-center text-lg hover:text-blue-500 transition-colors duration-300">
                    Blogs
                </Link>
            </Typography>
            {(!storedUser || !userRole) && (
                <Typography as="li" className="p-1 font-normal">
                    <Link to={'/adminlogin'} className="flex items-center text-lg hover:text-blue-500 transition-colors duration-300">
                        Sign In
                    </Link>
                </Typography>
            )}
        </ul>
    );

    return (
        <>
            {/* Navbar */}
            <Navbar
                className="sticky inset-0 z-20 h-max max-w-full border-none rounded-none py-4 px-6 lg:px-8 lg:py-4 backdrop-blur-md bg-opacity-80"
                style={{
                    background: mode === 'dark' ? "rgba(30, 41, 59, 0.8)" : 'rgba(243, 244, 246,0.8)',
                    boxShadow: mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                {/* Desktop View */}
                <div className="flex items-center justify-between">
                    {/* Home Page Link */}
                    <Link to={'/'}>
                        <Typography as="span" className="mr-4 cursor-pointer py-1.5 text-xl font-bold flex gap-2 items-center">
                            {/* Logo Image */}
                            <img className='w-30 h-10' src="https://i.imgur.com/gEHDYl2.png" alt="logo" />
                        </Typography>
                    </Link>

                    {/* Navbar Items */}
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:block">{navList}</div>

                        {/* Search & Share Icons */}
                        <div className="hidden lg:flex items-center gap-4">
                            <SearchDialog />
                            <ShareDialogBox />
                        </div>

                        {/* Show Avatar if User is Logged In */}
                        {storedUser && userRole && (
                            <Link to={avatarRedirectPath}>
                                <Avatar
                                    src={'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'}
                                    alt="User Avatar"
                                    withBorder={true}
                                    className="p-0.5 w-10 h-10 hover:scale-110 transition-transform duration-300"
                                    style={{
                                        border: mode === 'dark'
                                            ? '2px solid rgb(226, 232, 240)'
                                            : '2px solid rgb(30, 41, 59)'
                                    }}
                                />
                            </Link>
                        )}

                        {/* Dark & Light Mode Toggle */}
                        <IconButton
                            onClick={toggleMode}
                            className="lg:inline-block rounded-full hover:bg-opacity-20 transition-colors duration-300"
                            style={{
                                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            {mode === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                        </IconButton>

                        {/* Mobile Menu Toggle */}
                        <IconButton
                            className="ml-auto h-10 w-10 text-inherit rounded-lg lg:hidden"
                            onClick={() => setOpenNav(!openNav)}
                            style={{
                                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            {openNav ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </IconButton>
                    </div>
                </div>

                {/* Mobile View */}
                <Collapse open={openNav} className="lg:hidden">
                    <div className="mt-4">
                        {navList}
                    </div>
                </Collapse>
            </Navbar>
        </>
    );
}