import React, { useRef, useState } from "react";
import Input from "../../components/Shared/Input";
import Dropdown from "../../components/Shared/Dropdown";
import "./index.css";

import parseImage from "../../utils/parseImage";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { editUserData, me } from "../../store/authSlice";
import apis from "../../services/api";
import { CANADA_PROVINCES, US_STATES } from "../../utils/constants";
import useNotification from "../../hooks/useNotification";
import ImageCompressor from "image-compressor.js";
import { imageFallback } from "../../utils/listingCardFunctions";
import {
  CloseOutlined,
  Edit,
  ImageOutlined,
  Person2Outlined,
  PhoneOutlined,
  PinDropOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import { useLocalStorage } from "@uidotdev/usehooks";
import ripple from "../../utils/ripple";

function UpdateProfile({ close }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [country, setCountry] = useLocalStorage("country", null);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [image, setImage] = useState(user?.image || "");
  const [phone, setPhone] = useState(user?.info?.phone || "");

  const [city, setCity] = useState(user?.info?.city || "");
  const [province, setProvince] = useState(user?.info?.province || "");

  const [nickname, setNickname] = useState(user?.info?.nickname || "");

  const ref = useRef();
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

  const notification = useNotification();

  async function submit() {
    if (validateInput(firstName, "First Name")) {
      const body = {
        firstName: firstName || user.firstName,
        lastName: lastName,

        image,
        info: {
          phone: phone,

          city,
          province: province == "select" ? "" : province,

          nickname: nickname.trim(),
        },
      };

      const res = await axios.put(apis.users + "/" + user._id, body);

      dispatch(editUserData(res.data));
      notification.success("Profile updated successfully");

      close();
    }
  }

  return (
    <div className="update_profile">
      <section>
        <h1>
          <ImageOutlined /> Profile Image
        </h1>
        <div className="upload_image">
          <input
            type="file"
            accept=".jpg, .jpeg"
            style={{ display: "none" }}
            onChange={async (e) => {
              if (!e?.target?.files[0]) return;
              const imageCompressor = new ImageCompressor();
              const _img = await imageCompressor.compress(e.target.files[0], {
                quality: 0.4,
              });
              const img = await parseImage(_img);
              setImage(img);
            }}
            ref={ref}
          />
          <img src={image} alt="" onError={imageFallback} />
          <div className="buttons">
            {" "}
            <button className="edit" onClick={() => ref.current.click()}>
              <Edit />
            </button>
            <button className="delete" onClick={() => setImage("")}>
              <CloseOutlined />
            </button>
          </div>
        </div>
      </section>
      <section>
        <h1>
          <Person2Outlined /> Full Name
        </h1>
        <div className="inputs">
          <Input
            placeholder="Firstname"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          ></Input>
          <Input
            placeholder="Lastname"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          ></Input>
        </div>
      </section>
      <section>
        <h1>
          <PhoneOutlined /> Phone and Nickname
        </h1>
        <div className="inputs">
          <Input
            placeholder="Phone Number"
            type="number"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(String(e.target.value)?.slice(0, 10))}
          ></Input>
          <Input
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          ></Input>
        </div>
      </section>
      <section>
        <h1>
          <PinDropOutlined /> Location
        </h1>
        <div className="inputs">
          <Input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Input>
          <Dropdown
            placeholder="Province/State"
            value={province}
            array={
              country == "US"
                ? US_STATES.map((s) => s.label)
                : CANADA_PROVINCES.map((p) => p.label)
            }
            setValue={(v) => setProvince(v)}
          />
        </div>
      </section>

      <div className="buttons">
        <button
          className="btn_blue_m delete"
          onClick={(e) => ripple(e, { dur: 2, cb: close })}
        >
          <CloseOutlined /> Discard
        </button>
        <button
          className="btn_blue_m"
          onClick={(e) => ripple(e, { dur: 2, cb: submit })}
        >
          <SaveOutlined /> Save
        </button>
      </div>
    </div>
  );
}

export default UpdateProfile;
