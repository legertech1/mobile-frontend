import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";

const PinchZoomImage = ({ src, alt, onSwipedLeft, onSwipedRight }) => {
  const imageRef = useRef(null);
  const [initialDistance, setInitialDistance] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [scale, setScale] = useState(1);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
      );
      setInitialDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
      );
      setCurrentDistance(distance);
      const delta = (distance - initialDistance) / 300; // Adjust sensitivity here
      let newScale = scale + delta;

      // Cap the scale between 1 and 3
      newScale = Math.max(1, Math.min(3, newScale));

      // Round to the nearest 0.5
      newScale = Math.round(newScale * 2) / 2;

      if (newScale < scale) newScale = 1;
      setScale(newScale < 1 ? 1 : newScale);
    }
  };

  const handleTouchEnd = (e) => {
    setInitialDistance(0);
    setCurrentDistance(0);
  };
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (scale == 1) {
        onSwipedLeft();
      }
    },
    onSwipedRight: () => {
      if (scale == 1) {
        onSwipedRight();
      }
    },
    trackTouch: true,
  });

  return (
    <div
      {...swipeHandlers}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={(e) => {
        setScale(scale == 1 ? 2 : 1);
      }}
      style={{
        height: "100%",
        position: "absolute",
        width: "100%",
        top: "0",
        zIndex: 5,
        left: "0",
        pointerEvents: "all",
        overflow: "scroll",
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          maxWidth: "100%",
          minWidth: "100%",
          height: "100%",
          cursor: "zoom-in",
          objectFit: "contain",
          transformOrigin: "left",
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
};

export default PinchZoomImage;
