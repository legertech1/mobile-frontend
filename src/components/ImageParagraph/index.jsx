import React from "react";
import "./index.css";
import { imageFallback } from "../../utils/listingCardFunctions";

const ImageParagraph = ({ imageSource, paragraphText, reverse }) => {
  return (
    <div
      className={`image-paragraph-container ${reverse ? "reverse-img" : ""}`}
    >
      <div className="image-container">
        <img
          onError={imageFallback}
          src={imageSource}
          className="img"
          alt="Content"
        />
      </div>
      <div className="paragraph-container">{paragraphText}</div>
    </div>
  );
};

export default ImageParagraph;
