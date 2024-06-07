import React, { useRef, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./GridCarousel.css";
import { imageFallback } from "../utils/listingCardFunctions";

// example props for images:
// const images = ["src"]

const GridCarousel = ({ images }) => {
  const [currImg, setCurrImg] = useState(images[0]);
  const [currIndex, setCurrIndex] = useState(0);
  const currentView = useRef();

  const handlePrev = () => {
    setCurrImg(images[currIndex - 1]);
    setCurrIndex(currIndex - 1);
    const grid = document.querySelector(".grid-carousel-content");
    grid.scrollBy({
      top: 0,
      left: -200,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    setCurrImg(images[currIndex + 1]);
    setCurrIndex(currIndex + 1);
    currentView.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const scroll = (scrollOffset, index) => {
    if (currIndex === index) return;
    setCurrImg(index);
    const grid = document.querySelector(".grid-carousel-content");
    if (index > currIndex) {
      grid.scrollBy({
        top: 0,
        left: scrollOffset + 200,
        behavior: "smooth",
      });
    } else {
      grid.scrollBy({
        top: 0,
        left: -scrollOffset - 200,
        behavior: "smooth",
      });
    }
  };

  const renderItems = () => {
    return images.map((src, index) => (
      <div
        onClick={() => {
          scroll(100, index);
          setCurrIndex(index);
          setCurrImg(src);
        }}
        ref={index === currIndex ? currentView : null}
        key={index}
        className={`grid-carousel-item ${
          index === currIndex ? "grid-carousel-item-selected" : ""
        }`}
      >
        <div className="img_cont">
          <img onError={imageFallback} src={src} alt="img" />
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="curr_img_cont">
        {/* <button
          onClick={handlePrev}
          className="carousel_button prev"
          style={{
            display: currIndex < 1 ? "none" : "block",
          }}
        >
          <KeyboardArrowLeftIcon />
        </button> */}
        <div
          className="main_img"
          // onScroll={(e) => e.preventDefault()}
          // ref={carousel}
        >
          <img onError={imageFallback} src={currImg} alt="img" />
        </div>
        {/* <button
          className="carousel_button next"
          style={{
            display: currIndex >= images.length - 1 ? "none" : "block",
          }}
          onClick={handleNext}
        >
          <KeyboardArrowRightIcon />
        </button> */}
      </div>
      <div className="grid-carousel">
        <div className="grid-carousel-content">{renderItems()}</div>
      </div>
    </>
  );
};

export default GridCarousel;
