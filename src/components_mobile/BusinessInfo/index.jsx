import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import apis from "../../services/api";
import { me } from "../../store/authSlice";
import parseImage from "../../utils/parseImage";
import Input from "../shared/Input";
import Button from "../shared/Button";
import ClearIcon from "@mui/icons-material/Clear";
import { imageFallback } from "../../utils/listingCardFunctions";

function BusinessInfo({ close }) {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [businessInfo, setBusinessInfo] = useState({
    LOGO: null,
    name: "",
    address: "",
    youtube: "",
    website: "",
    phone: "",
    email: "",
  });
  const imageInp = useRef();

  useEffect(() => {
    if (!user) return;
    setBusinessInfo(user.BusinessInfo);
  }, [user]);

  async function updateBusinessInfo() {
    await axios.put(apis.updateBusinessInfo + user._id, businessInfo);
    dispatch(me());
    close();
  }
  const handleDeleteClick = () => {
    // Remove the image by updating the state
    setBusinessInfo({
      ...businessInfo,
      LOGO: null,
    });
  };


  return (
    <div className="mobile_business_info">
      <h2>Your Business Info</h2>
      <div className="content">
        <div className="field_container">
          <div className="field_info">
            <h4>Business LOGO:</h4>
            <p>
              An image of your Business LOGO. Click on the box to choose image
            </p>
          </div>

          <div className="img_cont">
            <div
              className="image_input"
              onClick={(e) => {
                e.stopPropagation();
                imageInp.current.click();
              }}
            >
              <div className="wrap-delete-cont">
                <span className="delete_icon_cont">
                  {businessInfo?.LOGO && (
                    <div className="delete_img_btn">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick();
                        }}
                      >
                        <ClearIcon />
                      </button>
                    </div>
                  )}
                </span>
              </div>
              {!businessInfo?.LOGO && <p>Click to edit</p>}

              {businessInfo?.LOGO && (
                <img
                  onError={imageFallback}
                  src={businessInfo?.LOGO}
                  alt="Logo"
                ></img>
              )}
              <input
                style={{ display: "none" }}
                onChange={(e) => {
                  if (!e.target.files[0]) return;
                  parseImage(e.target.files[0], (v) =>
                    setBusinessInfo({
                      ...businessInfo,
                      LOGO: v,
                    })
                  );
                }}
                ref={imageInp}
                type="file"
              />
            </div>
          </div>
        </div>
        <div className="field_container">
          <div className="field_info">
            <h4>
              Business Name:<span>(required)</span>
            </h4>
            <p>Enter the official name of your Business.</p>
          </div>
          <Input
            placeholder={"What is the name of your Business?"}
            value={businessInfo?.name}
            onChange={(e) =>
              setBusinessInfo({ ...businessInfo, name: e.target.value })
            }
          ></Input>
        </div>
        <div className="field_container">
          <div className="field_info">
            <h4>Business Address:</h4>
            <p>Enter the address for your Business</p>
          </div>
          <Input
            placeholder={"Where is your Business Located?"}
            value={businessInfo?.address}
            onChange={(e) =>
              setBusinessInfo({ ...businessInfo, address: e.target.value })
            }
          ></Input>
        </div>
        <div className="field_container">
          <div className="field_info">
            <h4>Business Phone Number:</h4>
            <p>Enter a contact number for your Business. </p>
          </div>
          <Input
            placeholder={"(000)-000-0000"}
            value={businessInfo?.phone}
            onChange={(e) =>
              setBusinessInfo({ ...businessInfo, phone: e.target.value })
            }
          ></Input>
        </div>
        <div className="field_container">
          <div className="field_info">
            <h4>Business Email:</h4>
            <p>Enter an email for people to reach out to your Business</p>
          </div>
          <Input
            placeholder={"xyz@yourBusiness.com"}
            value={businessInfo?.email}
            onChange={(e) =>
              setBusinessInfo({ ...businessInfo, email: e.target.value })
            }
          ></Input>
        </div>
        <div className="field_container">
          <div className="field_info">
            <h4>Website URL:</h4>
            <p>Enter the URL for your Business's website.</p>
          </div>
          <Input
            placeholder={"http://yourBusiness.com"}
            value={businessInfo?.website}
            onChange={(e) =>
              setBusinessInfo({ ...businessInfo, website: e.target.value })
            }
          ></Input>
        </div>

        <div className="field_container">
          <div className="field_info">
            <h4>Youtube URL:</h4>
            <p>A link to a youtube video or channel about your Business.</p>
          </div>
          <Input
            placeholder={"http://youtube.com/xyz"}
            value={businessInfo?.youtube}
            onChange={(e) =>
              setBusinessInfo({ ...businessInfo, youtube: e.target.value })
            }
          ></Input>
        </div>
        <div className="actions">
          <Button className="mobile_btn_red" onClick={close}>
            Discard
          </Button>
          <Button onClick={updateBusinessInfo}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

export default BusinessInfo;
