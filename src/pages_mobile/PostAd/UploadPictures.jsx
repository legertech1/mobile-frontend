// src/components/HorizontalImageContainer.js
import React, { useEffect, useReducer, useRef, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import parseImage from "../../utils/parseImage";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../store/adSlice";
import ImageCompressor from "image-compressor.js";
import "./UploadPictures.css";
import Loader from "../../components/Loader";
import Modal from "../../components_mobile/Modal";
import PinchZoomImage from "../Ad/PinchToZoom";
import { useSwipeable } from "react-swipeable";
import { next, prev } from "../../utils/listingCardFunctions";
// import { AD_IMAGES_LIMIT } from "../../utils/constants";

// TODO: improve this component

const UploadPictures = () => {
  const [dragging, setDragging] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const [imgView, setImgView] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [key, setKey] = useReducer((key) => key + 1, 0); // for resetting file input
  const [changedKey, setChangedKey] = useState(""); // modified or delete
  const lastImageRef = React.useRef();
  const formData = useSelector((state) => state.ad);
  const images = useSelector((state) => state.ad.images);
  const [dragged, setDragged] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const AD_IMAGES_LIMIT = cart?.package?.item?.images;
  const [loading, setLoading] = useState(0);
  useEffect(() => {
    if (changedKey !== "delete") {
      handleScroll();
    }
  }, [changedKey, images]);

  const handleScroll = () => {
    if (lastImageRef.current) {
      lastImageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };
  const imageCompressor = new ImageCompressor();
  const handleFiles = async (files) => {
    setLoading(files.length);
    const imgs = [];
    // console.log(files.length);
    const thumbnails = [];
    for (let file of files) {
      // console.log(file.name);
      const _img = await imageCompressor.compress(file, { quality: 0.8 });
      const _thumbnail = await imageCompressor.compress(_img, {
        quality: 0.5,
      });
      const img = await parseImage(_img);
      const thumbnail = await parseImage(_thumbnail);

      imgs.push(img);
      thumbnails.push(thumbnail);

      dispatch(
        setFormData({
          ...formData,
          images: [...formData.images, ...imgs],
          thumbnails: [...formData.thumbnails, ...thumbnails],
        })
      );
    }
    setLoading(0);

    const totalImages = [...images, ...files];
    if (totalImages.length > AD_IMAGES_LIMIT) {
      alert(`You can only upload ${AD_IMAGES_LIMIT} images`);
      return;
    }
    // onChange([...images, ...files]);
    setChangedKey("modified");
  };

  const handleFileInputChange = (e) => {
    const files = [...e.target.files];

    if (images.length + files.length > AD_IMAGES_LIMIT) {
      alert(`You can only upload ${AD_IMAGES_LIMIT} images`);

      return;
    }

    handleFiles(files);
    setKey();
  };

  const openUploadDialog = () => {
    if (images.length === AD_IMAGES_LIMIT) {
      alert(`You can only upload ${AD_IMAGES_LIMIT} images`);

      return;
    }

    document.getElementById("OpenImgUpload").click();
  };

  const removeImage = (key) => {
    dispatch(
      setFormData({
        ...formData,
        images: [...formData.images.filter((_, i) => i != key)],
        thumbnails: [...formData.thumbnails.filter((_, i) => i != key)],
      })
    );
  };
  const [slide, setSlide] = useState(1);
  const carousel2 = useRef();
  const ind = useRef();
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),

    trackMouse: true,
  });

  const handleSwipe = (direction) => {
    if (direction === "left") {
      if (slide + 1 <= images.length)
        next({ thumbnails: images }, slide, setSlide);
    } else if (direction === "right") {
      if (slide - 1 > 0) prev({ thumbnails: images }, slide, setSlide);
    }
  };

  return (
    <div className="upload">
      {imgView && (
        <Modal
          className={"gallery"}
          close={(e) => setImgView(false)}
          heading={"Image " + slide + " of " + images.length}
        >
          <div className="_gallery">
            <div className={"images_container"} tabIndex={0}>
              <div className="slides" ref={ind}>
                {images?.length > 1 &&
                  images.map((img, i) => (
                    <div
                      className={"dot" + (i + 1 == slide ? " active" : "")}
                    ></div>
                  ))}
              </div>

              <div
                className="images"
                onScroll={(e) => e.preventDefault()}
                ref={carousel2}
              >
                {images?.map((img, ind) => (
                  <div
                    className="img_cont"
                    style={{
                      transform: "translateX(" + (ind + 1 - slide) + "00%)",
                    }}
                  >
                    <PinchZoomImage
                      src={img}
                      onSwipedLeft={() => handleSwipe("left")}
                      onSwipedRight={() => handleSwipe("right")}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
      <div className="image_gallery">
        <div className="image_scroll">
          {[...Array(AD_IMAGES_LIMIT)].map((image, index) => (
            <>
              <div
                onClick={() => {
                  if (!images[index]) return openUploadDialog();
                  setImageIndex(index);
                  setImgView(true);
                  setSlide(index + 1);
                }}
                ref={index === images.length - 1 ? lastImageRef : null}
                className={"image_item" + (index == 0 ? " cover" : "")}
                id={index + "_img"}
                key={index}
              >
                {/* {index + 1 <= loading ? (
                      <Loader />
                    ) : (
                      <AddPhotoAlternateOutlinedIcon className="add_photo_icon" />
                    )} */}
                {images[index] && (
                  <>
                    <div className="img_container">
                      <img
                        className="image_blob"
                        src={images[index]}
                        alt={`img ${index + 1}`}
                      />
                    </div>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="carousel_delete_icon"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </div>
                  </>
                )}
                {!images[index] && index < loading && <Loader />}
                {!images[index] && index >= loading && (
                  <AddPhotoAlternateOutlinedIcon className="add_photo_icon" />
                )}
              </div>
            </>
          ))}
        </div>
        <input
          type="file"
          id="OpenImgUpload"
          accept=".jpg, .jpeg, .png, .gif"
          onChange={handleFileInputChange}
          multiple
          key={key}
        />
      </div>
    </div>
  );
};

export default UploadPictures;
