import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function HeroSection() {
    const context = useContext(myContext);
    const { mode } = context;
    
    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        pauseOnHover: false,
        fade: true,
        cssEase: 'linear'
    };

    // Array of images for the slider
    const sliderImages = [
        "https://i.imgur.com/mjj34Ue.jpg",
        "https://i.imgur.com/to09FoS.jpg",
        "https://i.imgur.com/i1MK1sT.jpg",
        "https://i.imgur.com/3Gv1fGW.jpg"
    ];

    return (
        <section >
            <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
                <main>
                    <div className="text-center w-full">
                        <div className="mb-2 w-full">
                            {/* Image Slider */}
                            <div className="w-full">
                                <Slider {...settings}>
                                    {sliderImages.map((image, index) => (
                                        <div key={index} className="relative w-full h-64">
                                            <img 
                                                src={image} 
                                                alt={`slide-${index}`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>

                            {/* Text */}
                            <p
                                style={{ color: mode === 'dark' ? 'white' : 'white' }}
                                className="sm:text-3xl text-xl font-extralight sm:mx-auto mt-4">
                                Come together Food Provider and Distributor to Reduce Food Wastage
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </section>
    )
}

export default HeroSection;