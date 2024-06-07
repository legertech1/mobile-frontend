import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { me } from "../../store/authSlice";
import Button from "../../components_mobile/shared/Button";
import Input from "../../components_mobile/shared/Input";
import Dropdown from "../../components_mobile/shared/Dropdown";
import Checkbox from "../../components_mobile/shared/Checkbox";
import Loader from "../../components_mobile/Loader";
import { CANADA_PROVINCES } from "../../utils/constants";
import parseImage from "../../utils/parseImage";
import "./index.css";
import axios from "axios";
import apis from "../../services/api";
import { useNavigate } from "react-router-dom";
import useNotification from "../../hooks/useNotification";
import { handleImgError } from "../../utils/helpers";

const countryCodes = ["+1"];

function isNumber(v) {
  return /^[0-9]$/i.test(v);
}

function isLetter(v) {
  return /^[a-zA-Z]*$/.test(v);
}

export default function UserProfile() {
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState("+1");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Select");
  const [postalCode, setPostalCode] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneHidden, setPhoneHidden] = useState(false);
  const [locationHidden, setLocationHidden] = useState(false);
  const [loading, setLoading] = useState(false);

  const ref = useRef();
  const navigate = useNavigate();

  function onChangePhone(e, setState) {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");

    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setState(value);
  }

  useEffect(() => {
    if (user) {
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
      setNickname(user?.info?.nickname || "");
      setAddress(user?.info?.address || "");
      setCity(user?.info?.city || "");
      setProvince(user?.info?.province || "Select");
      // setPostalCode(user?.info?.postalCode || "");
      setImage(user?.image || "");
      setPhone(user?.info?.phone?.split(" ")[1] || "");
      setCountryCode(user?.info?.phone?.split(" ")[0] || "+1");
      setLocationHidden(user?.info?.locationHidden || false);
      setPhoneHidden(user?.info?.phoneHidden || false);
    }
  }, [user]);

  function onChangePostalCode(e, setState) {
    let newInput = e.target.value.toUpperCase();

    if (newInput.length < postalCode.length) {
      setState(newInput);
      return;
    } else {
      if (postalCode.length === 0) {
        if (isLetter(newInput)) {
          setState(newInput);
        }
      } else {
        if (newInput.length === 7) return;
        const lastChar = postalCode.slice(-1);
        const newInputLastChar = newInput.slice(-1);
        if (isLetter(lastChar) && isNumber(newInputLastChar)) {
          setState(newInput);
        } else if (isNumber(lastChar) && isLetter(newInputLastChar)) {
          setState(newInput);
        }
      }
    }
  }

  const clearFields = () => {
    navigate("/profile");
    // setFirstName(user?.firstName || "");
    // setLastName(user?.lastName || "");
    // setNickname(user?.info?.nickname || "");
    // setAddress(user?.info?.address || "");
    // setCity(user?.info?.city || "");
    // setProvince(user?.info?.province || "Select");
    // setPostalCode(user?.info?.postalCode || "");
    // setImage(user?.image || "");
    // setPhone(user?.info?.phone?.split(" ")[1] || "");
    // setCountryCode(user?.info?.phone?.split(" ")[0] || "+1");
    // setLocationHidden(user?.info?.locationHidden || false);
    // setPhoneHidden(user?.info?.phoneHidden || false);
  };

  function validateInput(input, fieldName) {
    const pattern = /^[a-zA-Z0-9\s]*$/;

    if (!input.trim()) {
      alert(`${fieldName} is required`);
      return false;
    }

    if (!pattern.test(input)) {
      alert(`${fieldName} cannot contain special characters`);
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (loading) {
      scrollToBottom();
    }
  }, [loading]);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  const notification = useNotification();

  async function submit() {
    if (
      validateInput(firstName, "First Name") &&
      validateInput(lastName, "Last Name")
      // &&
      // validateInput(nickname, "Nickname") &&
      // validateInput(city, "City")
    ) {
      setLoading(true);
      const body = {
        firstName:
          firstName.trim()[0].toUpperCase() + firstName.trim().slice(1) ||
          user.firstName,
        lastName: lastName
          ? lastName.trim()[0].toUpperCase() + lastName.trim().slice(1)
          : "",
        image: image || user.image,
        info: {
          phone: phone ? countryCode + " " + phone : "",
          phoneHidden,
          address,
          locationHidden,
          city,
          province: province == "select" ? "" : province,
          postalCode,
          nickname: nickname.trim(),
        },
      };
      await axios.put(apis.users + "/" + user._id, body);
      setLoading(false);

      dispatch(me());

      notification.success("Profile Updated");
      navigate("/profile");
    }
  }

  return (
    <div className="mobile_user_profile">
      <div className="card">
        <div className="image_container">
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) =>
              parseImage(e.target.files[0], (img) => setImage(img))
            }
            ref={ref}
          />
          <img
            onError={handleImgError}
            src={image}
            className="user_avatar_img"
            alt=""
          />

          <div className="two_col">
            <div className="delete_btn_cont">
              <Button onClick={() => setImage("")}>Delete</Button>
            </div>
            <div>
              <Button onClick={() => ref.current.click()}>Change</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="form_container">
          <div>
            <Input
              label="First Name:"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Last Name:"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Nickname:"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div>
            <lable className="mobile_input_label">Phone Number:</lable>
            <div className="phone_inp">
              <Dropdown
                array={countryCodes}
                value={countryCode}
                setValue={setCountryCode}
              ></Dropdown>
              <Input
                placeholder={"(000) 000-0000"}
                type="text"
                value={phone}
                // value={parsePhone(phone)}
                onChange={(e) => onChangePhone(e, setPhone)}
              ></Input>
            </div>
          </div>
          <div>
            <Input
              label="Address:"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="two_col">
            <div>
              <Input
                label="City:"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <Dropdown
                label={"Province:"}
                array={["Select", ...CANADA_PROVINCES.map((obj) => obj.value)]}
                value={province}
                setValue={setProvince}
              ></Dropdown>
            </div>
          </div>
          <div>
            <Input
              label="Postal Code:"
              placeholder={"X1X 1X1"}
              value={postalCode}
              onChange={(e) => onChangePostalCode(e, setPostalCode)}
            />
          </div>
          {/* <div className="preferences">
            <div className="preference">
              <p>Hide my Phone number from my public profile</p>{" "}
              <div>
                <Checkbox
                  checked={phoneHidden}
                  setChecked={setPhoneHidden}
                ></Checkbox>
              </div>
            </div>
            <div className="preference">
              <p>Hide my Location(City, Province) from my public profile</p>{" "}
              <div>
                <Checkbox
                  checked={locationHidden}
                  setChecked={setLocationHidden}
                ></Checkbox>
              </div>
            </div>
          </div> */}
          <div>{loading && <Loader title={"Updating Profile..."} />}</div>

          <div className="actions">
            <Button disabled={loading} onClick={clearFields} className="red">
              Discard
            </Button>

            <Button onClick={submit} disabled={loading}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
