import React, { useContext, useEffect, useState } from "react";
import {
    Navbar,
    IconButton,
    Avatar,
    Collapse,
    Button
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/data/myContext";
import SearchDialog from "../searchDialog/SearchDialog";
import ShareDialogBox from "../shareDialogBox/ShareDialogBox";

export default function Nav() {
    const [openNav, setOpenNav] = useState(false);
    const context = useContext(myContext);
    const { mode, toggleMode } = context;
    const navigate = useNavigate();

    // Fetch user data
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userRole = storedUser?.role;
    const avatarRedirectPath = userRole === "admin"
        ? "/dashboard"
        : userRole === "provider"
        ? "/donor-dashboard"
        : userRole === "distributor"
        ? "/ngo-dashboard"
        : "/reg";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
        window.location.reload();
    };

    // Vibrant gradient colors
    const navbarBg = mode === 'dark' 
        ? 'bg-gradient-to-r from-indigo-900 to-purple-900'
        : 'bg-gradient-to-r from-blue-500 to-purple-600';

    const navList = (
        <ul className="mb-4 mt-2 flex flex-col gap-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <li className="p-1 font-medium">
                <Link to={'/'} className="flex items-center text-lg text-white hover:text-yellow-300 transition-colors duration-300">
                    Home
                </Link>
            </li>
            <li className="p-1 font-medium">
                <Link to={'/allblogs'} className="flex items-center text-lg text-white hover:text-yellow-300 transition-colors duration-300">
                    Blogs
                </Link>
            </li>
        </ul>
    );

    return (
        <Navbar
            className={`sticky top-0 z-50 h-max max-w-full rounded-none border-none py-3 px-6 lg:px-8 lg:py-4 ${navbarBg} shadow-lg`}
            blurred={false}
            fullWidth
        >
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link to={'/'} className="flex items-center">
                    <img 
                        className="h-10" 
                        src="https://i.imgur.com/gEHDYl2.png" 
                        alt="FoodShare logo" 
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-6">
                    {navList}

                    <div className="flex items-center gap-4">
                        <ShareDialogBox />

                        {/* Theme Toggle */}
                        <IconButton
                            variant="text"
                            onClick={toggleMode}
                            className="rounded-full text-white hover:bg-white/20"
                        >
                            {mode === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                                </svg>
                            )}
                        </IconButton>

                        {/* User Avatar - Now directly navigates without dropdown */}
                        {storedUser ? (
                            <Link to={avatarRedirectPath}>
                                <Avatar
                                    src={'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'}
                                    alt="User Avatar"
                                    size="sm"
                                    className="cursor-pointer border-2 border-white hover:border-yellow-300 transition-all"
                                />
                            </Link>
                        ) : (
                            <Button 
                                variant="filled" 
                                size="sm" 
                                color="yellow"
                                className="hidden lg:inline-block"
                                onClick={() => navigate('/adminlogin')}
                            >
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-4 lg:hidden">
                    <SearchDialog mobile={true} />
                    <IconButton
                        variant="text"
                        onClick={() => setOpenNav(!openNav)}
                        className="text-white hover:bg-white/20"
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

            {/* Mobile Menu */}
            <Collapse open={openNav} className="lg:hidden">
                <div className="pt-4 pb-2">
                    {navList}
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <div className="flex items-center gap-2">
                            <IconButton
                                variant="text"
                                onClick={toggleMode}
                                className="text-white hover:bg-white/20"
                            >
                                {mode === 'light' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </IconButton>
                            <ShareDialogBox mobile={true} />
                        </div>
                        {storedUser ? (
                            <Link to={avatarRedirectPath}>
                                <Avatar
                                    src={'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'}
                                    alt="User Avatar"
                                    size="sm"
                                    className="border-2 border-white"
                                />
                            </Link>
                        ) : (
                            <Button 
                                variant="filled" 
                                size="sm" 
                                color="yellow"
                                onClick={() => navigate('/adminlogin')}
                            >
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>
            </Collapse>
        </Navbar>
        
    );
}