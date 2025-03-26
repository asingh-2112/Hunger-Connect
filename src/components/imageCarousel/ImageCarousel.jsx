import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ImageCarousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg shadow-xl">
      {/* Slide */}
      <div
        className="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {slides[currentIndex].title}
            </h2>
            <p className="text-lg md:text-xl text-white mb-6">
              {slides[currentIndex].description}
            </p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300">
              {slides[currentIndex].buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((slide, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition ${
              currentIndex === slideIndex ? 'bg-white w-6' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;