import React, { useState } from "react";
import blue_dot from "../../assets/images/blue_dot.svg";
import gray_dot from "../../assets/images/gray_dot.svg";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./index.css";
import Modal from "../../components/Modal";
import { handleImgError } from "../../utils/helpers";

export default function MobileCarousel({ images = [] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [viewImage, setViewImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nextImage = () => {
    if (currentImageIndex === images.length - 1) {
      return;
    }
    setIsLoading(true); // Set loading state to true when changing image
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    if (currentImageIndex === 0) {
      return;
    }
    setIsLoading(true); // Set loading state to true when changing image
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) {
      return;
    }
    const touchEndX = e.touches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 50) {
      prevImage();
      setTouchStartX(null);
    } else if (deltaX < -50) {
      nextImage();
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  const handleImageLoad = () => {
    setIsLoading(false); // Set loading state to false when image is loaded
  };

  const dots = images.map((_, index) => (
    <img
      key={index}
      src={index === currentImageIndex ? blue_dot : gray_dot}
      alt={index === currentImageIndex ? "blue_dot" : "gray_dot"}
    />
  ));

  return (
    <>
      <div
        className="mobile_carousel"
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 1 && (
          <button onClick={prevImage} className="btn prev_button">
            <KeyboardArrowLeftIcon />
          </button>
        )}
        <div className="image_container">
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
                color: "white",
                fontSize: "1.5rem",
              }}
            >
              Loading image...
            </div>
          )}
          <img
            onError={handleImgError}
            className="carousel_image"
            src={images[currentImageIndex]}
            alt={`i ${currentImageIndex}`}
            onClick={() => setViewImage(true)}
            loading="lazy"
            onLoad={handleImageLoad}
            style={{
              // display: isLoading ? "none" : "block"
              visibility: isLoading ? "hidden" : "visible",
            }} // Hide the image while loading
            width="100%"
            height="100%"
          />
        </div>
        {images.length > 1 && <div className="dots_container">{dots}</div>}
        {images.length > 1 && (
          <button onClick={nextImage} className="btn next_button">
            <KeyboardArrowRightIcon />
          </button>
        )}
      </div>
      {viewImage && (
        <Modal close={() => setViewImage(false)}>
          <div className="mobile_image_modal">
            <img
              src={images[currentImageIndex]}
              alt={`img ${currentImageIndex + 1}`}
              onError={handleImgError}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
