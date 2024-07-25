import {
  AlternateEmail,
  DateRange,
  EditOutlined,
  FmdGoodOutlined,
  GridViewOutlined,
  Language,
  LocalPhone,
  Phone,
  PinDropOutlined,
  YouTube,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { imageFallback } from "../../utils/listingCardFunctions";
import { monthNames } from "../../utils/constants";
import Modal from "../Modal";
import UpdateProfile from "./EditProfile";
import BusinessInfo from "../../components/BusinessInfo";

function BInfo() {
  const user = useSelector((state) => state.auth);
  const [edit, setEdit] = useState(false);
  return (
    <div className="_user_info">
      <div className="info">
        {!user?.BusinessInfo?.LOGO ||
          (!user?.BusinessInfo?.name && <p>No Business Info</p>)}
        <div className="b_main">
          <img src={user?.BusinessInfo?.LOGO} alt="" />
          <div className="in">
            <p className="name">{user?.BusinessInfo?.name}</p>
            <p className="line">
              <AlternateEmail /> {user?.BusinessInfo?.email}
            </p>
            <p className="line">
              <Language /> {user?.BusinessInfo?.website}
            </p>
            <p className="line">
              <Phone />{" "}
              {user?.BusinessInfo?.phone &&
                `(${user.BusinessInfo.phone.slice(
                  0,
                  3
                )}) ${user.BusinessInfo.phone.slice(
                  3,
                  6
                )}-${user.BusinessInfo.phone.slice(6)}`}
            </p>
            <p className="line">
              <YouTube /> {user?.BusinessInfo?.youtube}
            </p>
          </div>
        </div>
        <p className="address">
          <PinDropOutlined /> {user?.BusinessInfo?.address}
        </p>
      </div>
      <button onClick={(e) => setEdit(true)}>
        <EditOutlined />
        Edit Business Info
      </button>

      {edit && (
        <Modal
          className={"payment"}
          heading={
            <span>
              <EditOutlined /> Edit Profile Info
            </span>
          }
          close={(e) => setEdit(false)}
        >
          <BusinessInfo close={(e) => setEdit(false)} />
        </Modal>
      )}
    </div>
  );
}

export default BInfo;
