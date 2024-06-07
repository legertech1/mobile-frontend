import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Modal from "../../components_mobile/Modal";
import BusinessInfo from "../../components_mobile/BusinessInfo";

import { monthNames } from "../../utils/constants";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useNavigate, useParams } from "react-router-dom";
import DisplayType from "../../components_mobile/DisplayType";
import ButtonTabs from "../../components_mobile/ButtonTabs";
import Listings from "../../components_mobile/Listings";
import RowListings from "../../components_mobile/RowListings";
import Loader from "../../components_mobile/Loader";
import axios from "axios";
import apis from "../../services/api";
import "./index.css";
import { handleImgError } from "../../utils/helpers";

function ViewProfile() {
  const currUser = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("rows");
  const [listings, setListings] = useState([]);
  const [myAdsLoading, setMyAdsLoading] = useState(false);
  const params = useParams();
  const [showBusinessInfoForm, setShowBusinessInfoForm] = useState(false);

  // params?.tab
  const userId = params?.userId;

  const navigate = useNavigate();

  const Content = ({ tab }) => {
    return (
      <div>
        {viewMode == "grid" && (
          <Listings
            listings={listings}
            loading={myAdsLoading}
            infoText={"You haven't posted any ads yet"}
          />
        )}
        {viewMode == "rows" && (
          <RowListings
            listings={listings}
            loading={myAdsLoading}
            infoText={"You haven't posted any ads yet"}
          />
        )}
      </div>
    );
  };

  async function loadPerson(id) {
    let data = (await axios.get(apis.getUser + id)).data;
    setUser(data);
  }

  useState(() => {
    if (!userId) {
      setUser(currUser);
    } else {
      loadPerson(userId);
    }
  }, [userId]);

  async function getUserAds(id) {
    setMyAdsLoading(true);
    // setListings((await axios.get(apis.userAds + id)).data);
    const { results, total } = (
      await axios.post(apis.search, {
        additional: {
          user: id,
        },
        sort: { createdAt: -1 },
        page: 1,
        limit: 24,
        count: true,
        category: "All Categories",
        ignoreStatus: true,
        restrictCountry: true,
      })
    ).data;
    setListings(results);
    setMyAdsLoading(false);
  }

  useEffect(() => {
    user?._id && getUserAds(user._id);
  }, [user?._id]);

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="profile_container account">
      {" "}
      <div className="profile  profile_card">
        <div className="main">
          <img onError={handleImgError} src={user?.image} alt="" />
          <div className="profile_card_info">
            <h3>
              {user?.firstName} {user?.lastName}{" "}
              {user?.info?.nickname && <span>({user?.info?.nickname})</span>}
            </h3>
            <p>{user?.email}</p>
          </div>
        </div>

        <div className="profile_info">
          <hr />
          <div className="info_line">
            <span>
              {" "}
              <DateRangeIcon></DateRangeIcon> Member Since{" "}
            </span>
            {monthNames[new Date(user?.createdAt).getMonth()]},{" "}
            {new Date(user?.createdAt).getYear() + 1900}
          </div>
          <div className="info_line">
            <span>
              <LocalPhoneOutlinedIcon></LocalPhoneOutlinedIcon> Contact No.
            </span>
            {!user?.info?.phoneHidden && user?.info?.phone
              ? user?.info?.phone.split(" ")[0] +
                " " +
                user?.info?.phone.split(" ")[1].slice(0, 3) +
                " " +
                user?.info?.phone.split(" ")[1].slice(3, 6) +
                " " +
                user?.info?.phone.split(" ")[1].slice(6, 10)
              : "No data"}
          </div>
          <div className="info_line">
            <span>
              {" "}
              <FmdGoodOutlinedIcon />
              Location
            </span>
            {!user?.info?.locationHidden && user?.info?.city
              ? user?.info?.city + ", " + user?.info?.province
              : "No data"}
          </div>
          {currUser?._id == user._id && (
            <>
              <hr />
              <div className="actions">
                <button
                  className="edit_profile_button"
                  onClick={() => navigate("/user_profile")}
                >
                  <ModeEditOutlineOutlinedIcon />
                  Edit your Info{" "}
                </button>
              </div>
              <div className="actions">
                <button
                  className="edit_business_button"
                  onClick={(e) => setShowBusinessInfoForm(true)}
                >
                  <ModeEditOutlineOutlinedIcon />
                  Edit Business Info
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mobile_wishlist">
        <ButtonTabs
          disabled={true}
          key={params?.tab || "ads"}
          activeKey={params?.tab || "ads"}
          items={[
            {
              label: "Posted Ads",
              key: "ads",
              content: (
                <>{myAdsLoading ? <Loader /> : <Content tab={params?.tab} />}</>
              ),
            },
          ]}
          onChange={(key) => {
            navigate("/wishlist/" + key);
          }}
          extras={<DisplayType viewMode={viewMode} setViewMode={setViewMode} />}
        />
      </div>
      {showBusinessInfoForm && (
        <Modal close={(e) => setShowBusinessInfoForm(false)}>
          <BusinessInfo close={(e) => setShowBusinessInfoForm(false)} />
        </Modal>
      )}
    </div>
  );
}

export default ViewProfile;
