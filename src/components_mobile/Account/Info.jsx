import {
  DateRange,
  EditOutlined,
  FmdGoodOutlined,
  GridViewOutlined,
  LocalPhone,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { imageFallback } from "../../utils/listingCardFunctions";
import { monthNames } from "../../utils/constants";
import Modal from "../Modal";
import UpdateProfile from "./EditProfile";

function Info() {
  const user = useSelector((state) => state.auth);
  const [edit, setEdit] = useState(false);
  return (
    <div className="_user_info">
      <div className="info">
        <div className="pf">
          <img src={user?.image} alt="" onError={imageFallback} />
          <div>
            {" "}
            <h3>{user?.firstName + " " + user?.lastName || ""}</h3>
            {user?.info?.nickname && <p>({user?.info?.nickname})</p>}
          </div>
        </div>
        <hr />
        <div className="info_line">
          <span>
            {" "}
            <DateRange /> Member Since{" "}
          </span>
          {monthNames[new Date(user?.createdAt).getMonth()]},{" "}
          {new Date(user?.createdAt).getYear() + 1900}
        </div>
        <div className="info_line">
          <span>
            <LocalPhone /> Contact No.
          </span>
          {user?.info?.phone
            ? `(${user.info.phone.slice(0, 3)}) ${user.info.phone.slice(
                3,
                6
              )}-${user.info.phone.slice(6)}`
            : "No data"}
        </div>
        <div className="info_line">
          <span>
            {" "}
            <FmdGoodOutlined />
            Location
          </span>
          {user?.info?.city
            ? user?.info?.city + ", " + user?.info?.province
            : "No data"}
        </div>
        <div className="info_line">
          <span>
            {" "}
            <GridViewOutlined />
            Ads posted
          </span>
          {user?.data?.postedAds?.total || 0}
        </div>
        <button onClick={(e) => setEdit(true)}>
          <EditOutlined />
          Edit Profile Info
        </button>
      </div>

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
          <UpdateProfile close={(e) => setEdit(false)} />
        </Modal>
      )}
    </div>
  );
}

export default Info;
