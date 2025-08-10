import React, { useState, useEffect } from "react";

const TentangSlideshow = ({
  images,
  autoPlayInterval = 4000,
  className = "",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval, isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    // Resume auto-play after 10 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % images.length);
  };

  const prevSlide = () => {
    goToSlide(currentSlide === 0 ? images.length - 1 : currentSlide - 1);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    setIsAutoPlaying(false); // Pause auto-play in fullscreen
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsAutoPlaying(true); // Resume auto-play when closing
  };

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        closeFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className="text-center text-gray-500">No images to display</div>
    );
  }

  return (
    <div
      className={`relative w-full max-w-md md:max-w-lg h-auto ${className}`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main image container */}
      <div
        className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square border-2 border-gray-200 cursor-pointer group"
        onClick={openFullscreen}
      >
        <img
          src={images[currentSlide].src}
          alt={images[currentSlide].alt || `Slide ${currentSlide + 1}`}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />

        {/* Click to expand hint - fully transparent overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            klik untuk memperluas
          </div>
        </div>

        {/* Floating Navigation Arrows - Always visible if more than 1 image */}
        {images.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the fullscreen
                prevSlide();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 
                         bg-[#91CADB] hover:bg-[#7FB8CD] text-white 
                         w-10 h-10 rounded-full shadow-lg 
                         flex items-center justify-center
                         transition-all duration-300 hover:scale-110
                         z-20 border-2 border-white
                         opacity-80 hover:opacity-100"
              aria-label="Previous image"
            >
              <svg
                className="w-4 h-4 ml-[-2px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the fullscreen
                nextSlide();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 
                         bg-[#91CADB] hover:bg-[#7FB8CD] text-white 
                         w-10 h-10 rounded-full shadow-lg 
                         flex items-center justify-center
                         transition-all duration-300 hover:scale-110
                         z-20 border-2 border-white
                         opacity-80 hover:opacity-100"
              aria-label="Next image"
            >
              <svg
                className="w-4 h-4 ml-[2px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots indicator - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-[#91CADB] w-6"
                  : "bg-gray-300 hover:bg-[#91CADB] hover:bg-opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-3 bg-[#91CADB] text-white px-2 py-1 rounded-full text-xs font-medium">
          {currentSlide + 1} / {images.length}
        </div>
      )}

      {/* Transparent Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          {/* Minimal Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg z-60"
            aria-label="Close fullscreen"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Main Image Container with Shadow */}
          <div className="relative flex items-center justify-center max-w-[90vw] max-h-[90vh]">
            <img
              src={images[currentSlide].src}
              alt={images[currentSlide].alt || `Slide ${currentSlide + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Side Navigation with Subtle Shadows */}
            {images.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={prevSlide}
                  className="absolute left-[-70px] top-1/2 -translate-y-1/2 
                             bg-white/80 hover:bg-white/90 text-gray-700
                             w-12 h-12 rounded-full shadow-lg
                             flex items-center justify-center
                             transition-all duration-300 hover:scale-110
                             backdrop-blur-sm border border-gray-200"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-5 h-5 ml-[-2px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  className="absolute right-[-70px] top-1/2 -translate-y-1/2 
                             bg-white/80 hover:bg-white/90 text-gray-700
                             w-12 h-12 rounded-full shadow-lg
                             flex items-center justify-center
                             transition-all duration-300 hover:scale-110
                             backdrop-blur-sm border border-gray-200"
                  aria-label="Next image"
                >
                  <svg
                    className="w-5 h-5 ml-[2px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Bottom Image Info with Shadow */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                {/* Dots */}
                <div className="flex space-x-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? "bg-[#91CADB] w-4"
                          : "bg-gray-400 hover:bg-[#91CADB]/70"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                {/* Counter */}
                <span className="text-gray-700 text-sm font-medium">
                  {currentSlide + 1} / {images.length}
                </span>
              </div>
            </div>
          )}

          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={closeFullscreen} />
        </div>
      )}
    </div>
  );
};

export default TentangSlideshow;
