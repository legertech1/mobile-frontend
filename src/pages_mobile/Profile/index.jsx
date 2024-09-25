import {
  ArrowBack,
  DateRange,
  FmdGoodOutlined,
  GridViewOutlined,
  LocalPhone,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { imageFallback } from "../../utils/listingCardFunctions";
import { monthNames } from "../../utils/constants";
import axios from "axios";
import apis from "../../services/api";
import Listings from "../../components_mobile/listings/listings";
import ripple from "../../utils/ripple";
import throttle from "../../utils/throttle";
import "./index.css";
import Loader from "../../components/Loader";

function Profile() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);

  const [pageUA, setPageUA] = useState(1);

  const [countUA, setCountUA] = useState(0);

  const [loadingUA, setLoadingUA] = useState(false);

  const adsRef = useRef();
  const barRef = useRef();
  const containerRef = useRef();
  function handleScrollUA() {
    if (!adsRef.current || loadingUA || countUA <= listings.length) return;

    const container = adsRef.current;

    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10
    ) {
      setPageUA(pageUA + 1);
    }
  }
  async function getUserAds() {
    if (!user) return;
    setLoadingUA(true);
    const { results, total } = (
      await axios.post(apis.search, {
        additional: {
          user: [user?._id],
        },
        sort: { createdAt: -1 },
        page: pageUA,
        limit: 16,
        count: true,
        category: "All Categories",
        ignoreStatus: true,
        restrictCountry: true,
      })
    ).data;

    setListings((state) => (pageUA > 1 ? [...state, ...results] : results));
    setCountUA(total);
    setLoadingUA(false);
  }
  const navigate = useNavigate();
  useEffect(() => {
    // setListings([]);
    getUserAds();
  }, [user?._id, user?.data?.postedAds, pageUA]);
  async function fetchUser() {
    setUser((await axios.get(apis.getUser + params.id)).data);
  }
  useEffect(() => {
    fetchUser();
  }, [params]);
  return (
    <div
      className="_user_info PF"
      ref={adsRef}
      onScroll={throttle(handleScrollUA, 500)}
    >
      {user ? (
        <>
          <div className="header">
            <button
              className="back"
              onClick={(e) => ripple(e, { dur: 1, cb: () => navigate(-1) })}
            >
              <ArrowBack />
            </button>
            User Info
          </div>
          <div className="info r--">
            <div className="pf">
              <img src={user?.image} alt="" onError={imageFallback} />
              <div>
                {" "}
                <h3>{user?.firstName + " " + user?.lastName || ""}</h3>
                {user?.info?.nickname && <p>({user?.info?.nickname})</p>}
              </div>
            </div>

            <div className="in">
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
            </div>
          </div>
          <div className="ads user_ads" style={{ background: "transparent" }}>
            <h2>
              <GridViewOutlined /> {user?.firstName}'s Ads
            </h2>
            <Listings ads={listings} loading={loadingUA} />
          </div>
        </>
      ) : (
        <div className="loading_info">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Profile;
