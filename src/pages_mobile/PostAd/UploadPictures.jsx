// src/components/HorizontalImageContainer.js
import React, { useEffect, useReducer, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Modal from "../../components/Modal";
import parseImage from "../../utils/parseImage";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../store/adSlice";
import ImageCompressor from "image-compressor.js";
import "./UploadPictures.css";
import Loader from "../../components/Loader";
// import { AD_IMAGES_LIMIT } from "../../utils/constants";

// TODO: improve this component

const UploadPictures = () => {
  const [dragging, setDragging] = useState(false);
  const [viewImage, setViewImage] = useState(false);
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
      const _img = await imageCompressor.compress(file, { quality: 0.5 });
      const _thumbnail = await imageCompressor.compress(_img, {
        quality: 0.1,
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

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files.length > AD_IMAGES_LIMIT) {
      alert(`You can only upload ${AD_IMAGES_LIMIT} images`);
      return;
    }

    if (images.length + e.dataTransfer.files.length > AD_IMAGES_LIMIT) {
      alert(`You can only upload ${AD_IMAGES_LIMIT} images`);

      return;
    }

    const files = [...e.dataTransfer.files];

    handleFiles(files);
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

  return (
    <div className="upload">
      {viewImage && (
        <Modal close={() => setViewImage(false)} className={"image"}>
          <img src={images[imageIndex]} alt={`img ${imageIndex + 1}`} />
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
                  setViewImage(true);
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
                    <div className="image_options">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="carousel_delete_icon"
                      >
                        <DeleteOutlineOutlinedIcon />
                      </div>
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
