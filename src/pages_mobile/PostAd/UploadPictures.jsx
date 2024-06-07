// src/components/HorizontalImageContainer.js
import React, { useEffect, useReducer, useState } from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import Modal from "../../components/Modal";
import { randomKey } from "../../utils/helpers";
import "./UploadPictures.css";
import Modal from "../../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import ImageCompressor from "image-compressor.js";
import parseImage from "../../utils/parseImage";
import { setFormData } from "../../store/adSlice";

const UploadPictures = () => {
  const [viewImage, setViewImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [key, setKey] = useReducer((key) => key + 1, 0); // for resetting file input
  const [changedKey, setChangedKey] = useState(""); // modified or delete
  const lastImageRef = React.useRef();
  const fileInp = React.useRef();
  const formData = useSelector((state) => state.ad);
  const images = useSelector((state) => state.ad.images);

  const cart = useSelector((state) => state.cart);
  const AD_IMAGES_LIMIT = cart?.package?.item?.images;

  const dispatch = useDispatch();

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

  const handleFiles = async (files) => {
    const imgs = [];
    const thumbnails = [];
    for (let file of files) {
      const imageCompressor = new ImageCompressor();
      const _img = await imageCompressor.compress(file, { quality: 0.5 });
      const _thumbnail = await imageCompressor.compress(_img, {
        quality: 0.2,
      });
      const img = await parseImage(_img);
      const thumbnail = await parseImage(_thumbnail);

      imgs.push(img);
      thumbnails.push(thumbnail);
    }

    dispatch(
      setFormData({
        ...formData,
        images: [...formData.images, ...imgs],
        thumbnails: [...formData.thumbnails, ...thumbnails],
      })
    );

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

    if (files.length > AD_IMAGES_LIMIT) {
      alert(`You can only upload ${AD_IMAGES_LIMIT} images`);

      return;
    }

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

    fileInp.current.click();
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
    <div className="mobile_upload">
      {viewImage && (
        <Modal close={() => setViewImage(false)}>
          <div className="preview_image_modal">
            <img src={images[imageIndex]} alt={`img ${imageIndex + 1}`} />
          </div>
        </Modal>
      )}
      <input
        ref={fileInp}
        name=""
        id=""
        type="file"
        // accept=".jpg, .jpeg, .png, .gif"
        onChange={handleFileInputChange}
        multiple
        // capture="environment"
        key={key}
      />
      <div className="image_gallery">
        <div className="image_scroll">
          {images.map((image, index) => (
            <>
              <div
                ref={index === images.length - 1 ? lastImageRef : null}
                className="image_item"
                key={index}
              >
                <div className="image_options">
                  <div
                    onClick={() => removeImage(index)}
                    className="carousel_delete_icon"
                  >
                    <DeleteOutlineOutlinedIcon />
                  </div>

                  <div
                    onClick={() => {
                      setImageIndex(index);
                      setViewImage(true);
                    }}
                    className="carousel_open_icon"
                  >
                    <RemoveRedEyeOutlinedIcon />
                  </div>
                </div>

                <div className="img_container">
                  <img
                    className="image_blob"
                    src={image.src || image}
                    alt={`img ${index + 1}`}
                  />
                </div>
              </div>
              {index === images.length - 1 &&
                [...Array(AD_IMAGES_LIMIT - images.length)].map((_, index) => (
                  <div
                    onClick={openUploadDialog}
                    className="image_item"
                    key={index}
                  >
                    <AddPhotoAlternateOutlinedIcon className="add_photo_icon" />
                  </div>
                ))}
            </>
          ))}

          {images.length === 0 &&
            [...Array(AD_IMAGES_LIMIT)].map((_, index) => (
              <div
                onClick={openUploadDialog}
                className="image_item"
                key={index}
              >
                <AddPhotoAlternateOutlinedIcon className="add_photo_icon" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UploadPictures;
