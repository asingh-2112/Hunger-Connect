import React, { useContext } from 'react'
import myContext from '../../context/data/myContext';

function Footer() {
    const context = useContext(myContext);
    const { mode } = context;
    
    // Vibrant gradient colors
    const footerBg = mode === 'dark' 
        ? 'bg-gradient-to-r from-indigo-900 to-purple-900'
        : 'bg-gradient-to-r from-blue-500 to-purple-600';

    return (
        <footer className={`body-font ${footerBg} text-white`}>
            <div className="container px-5 py-8 mx-auto flex flex-col sm:flex-row items-center">
                {/* Logo Section */}
                <div className="flex items-center justify-center md:justify-start">
                    <img 
                        className='w-40' 
                        src="https://i.imgur.com/gEHDYl2.png" 
                        alt="HungerConnect logo"
                    />
                </div>

                {/* Copyright Text */}
                <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                    <p className="text-sm text-white/80">
                        © {new Date().getFullYear()} HungerConnect —
                        <a
                            href="https://twitter.com/hungerconnect"
                            className="text-white ml-1 hover:text-yellow-300 transition-colors"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            @hungerconnect
                        </a>
                    </p>
                </div>
                
                {/* Social Icons */}
                <div className="flex justify-center sm:justify-end mt-4 sm:mt-0">
                    {/* Facebook */}
                    <a 
                        href="#" 
                        className="ml-4 text-white hover:text-yellow-300 transition-colors"
                        aria-label="Facebook"
                    >
                        <svg
                            fill="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                        >
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                    </a>

                    {/* Twitter */}
                    <a 
                        href="#" 
                        className="ml-4 text-white hover:text-yellow-300 transition-colors"
                        aria-label="Twitter"
                    >
                        <svg
                            fill="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                        >
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                    </a>

                    {/* Instagram */}
                    <a 
                        href="#" 
                        className="ml-4 text-white hover:text-yellow-300 transition-colors"
                        aria-label="Instagram"
                    >
                        <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                        >
                            <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a 
                        href="#" 
                        className="ml-4 text-white hover:text-yellow-300 transition-colors"
                        aria-label="LinkedIn"
                    >
                        <svg
                            fill="currentColor"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={0}
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="none"
                                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                            />
                            <circle cx={4} cy={4} r={2} stroke="none" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Additional Links */}
            <div className="container px-5 py-4 mx-auto border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm">
                    <a href="#" className="text-white/80 hover:text-yellow-300 transition-colors">Privacy Policy</a>
                    <span className="hidden md:block text-white/30">•</span>
                    <a href="#" className="text-white/80 hover:text-yellow-300 transition-colors">Terms of Service</a>
                    <span className="hidden md:block text-white/30">•</span>
                    <a href="#" className="text-white/80 hover:text-yellow-300 transition-colors">Contact Us</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;