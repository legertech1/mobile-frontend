import React, { useEffect, useRef, useState } from "react";
import Input from "./Shared/Input";
import "./BusinessInfo.css";
import { useDispatch, useSelector } from "react-redux";
import parseImage from "../utils/parseImage";
import axios from "axios";
import apis from "../services/api";
import { editUserData, me } from "../store/authSlice";
import { imageFallback } from "../utils/listingCardFunctions";
import { CloseOutlined, DeleteOutline } from "@mui/icons-material";
import ImageCompressor from "image-compressor.js";

function BusinessInfo({ close }) {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [businessInfo, setBusinessInfo] = useState({
    LOGO: null,
    name: "",
    address: "",
    youtube: "",
    website: "",
    email: "",
  });
  const [phone, setPhone] = useState("");
  const imageInp = useRef();
  function parsePhone(phone) {
    phone =
      (phone.split(" ")[0] || "") +
      (phone.split(" ")[1] || "") +
      (phone.split(" ")[2] || "");
    let res = "";
    res += phone?.slice(0, 3);
    if (res.length == 3) res += " ";
    res += phone?.slice(3, 6);
    if (res.length == 7) res += " ";
    res += phone?.slice(6, 10);

    return res;
  }

  function handlePhoneChange(e, setState) {
    const isNumber = /^[0-9]$/i.test(e.key);
    if (e.key == "Backspace")
      setState((state) => state.slice(0, state.length - 1));
    if (!isNumber) return;
    setState((state) => {
      if (state.length == 10) return state;
      return state + e.key;
    });
  }
  useEffect(() => {
    if (!user) return;
    setBusinessInfo(user.BusinessInfo);
    setPhone(user?.BusinessInfo?.phone || "");
  }, [user]);

  async function updateBusinessInfo() {
    const res = await axios.put(apis.updateBusinessInfo + user._id, {
      ...businessInfo,
      phone,
    });
    dispatch(editUserData({ ...user, BusinessInfo: res.data }));
    close();
  }

  return (
    <div className="business_info">
      <h2>Your Business Info</h2>
      <div className="content">
        <div className="field_container">
          <div className="field_info">
            <h4>
              Business LOGO:<span>(required)</span>
            </h4>
            <p>
              An image of your Business LOGO. Click on the box to choose image
            </p>
          </div>

          <div
            className="image_input"
            onClick={(e) => imageInp.current.click()}
          >
            {!businessInfo?.LOGO && <p>Click to edit</p>}
            {businessInfo?.LOGO && (
              <>
                {" "}
                <img src={businessInfo?.LOGO}></img>
                <button
                  className="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBusinessInfo({
                      ...businessInfo,
                      LOGO: "",
                    });
                  }}
                >
                  <DeleteOutline />
                </button>
              </>
            )}
            <input
              style={{ display: "none" }}
              onChange={async (e) => {
                if (!e?.target?.files[0]) return;
                const imageCompressor = new ImageCompressor();
                const _img = await imageCompressor.compress(e.target.files[0], {
                  quality: 0.4,
                });
                const img = await parseImage(_img);
                setBusinessInfo({
                  ...businessInfo,
                  LOGO: img,
                });
              }}
              ref={imageInp}
              type="file"
              accept=".jpg, .jpeg"
            />
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
            maxLength="50"
            placeholder={"What is the name of your Business?"}
            value={businessInfo?.name}
            onChange={(e) =>
              setBusinessInfo({ ...businessInfo, name: e.target.value })
            }
          ></Input>
        </div>
        <div className="field_container">
          <div className="field_info">
            <h4>
              Business Address:<span>(required)</span>
            </h4>
            <p>Enter the address for your Business</p>
          </div>
          <Input
            maxLength="200"
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
            maxLength="30"
            placeholder={"(000)-000-0000"}
            value={parsePhone(phone || "")}
            onKeyDown={(e) => handlePhoneChange(e, setPhone)}
          ></Input>
        </div>
        <div className="field_container">
          <div className="field_info">
            <h4>Business Email:</h4>
            <p>Enter an email for people to reach out to your Business</p>
          </div>
          <Input
            maxLength="50"
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
            maxLength="30"
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
            maxLength="30"
            placeholder={"http://youtube.com/xyz"}
            value={businessInfo?.youtube}
            onChange={(e) =>
              setBusinessInfo({ ...businessInfo, youtube: e.target.value })
            }
          ></Input>
        </div>
      </div>

      <div className="actions">
        <button className="btn_red_m" onClick={close}>
          Discard
        </button>
        <button className="btn_blue_m" onClick={updateBusinessInfo}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default BusinessInfo;
