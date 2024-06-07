import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Modal from "../../components/Modal";
import { useSelector } from "react-redux";
import DateRangeIcon from "@mui/icons-material/DateRange";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import blackAnimatedLOGO from "../../assets/animatedIcons/animated_black_LOGO.json";
import IconPlayer from "../../components/IconPlayer";
import Listings from "../../components/Listings";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import UpdateProfile from "./UpdateProfile";
import "./index.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apis from "../../services/api";
import axios from "axios";
import TableRowsSharpIcon from "@mui/icons-material/TableRowsSharp";
import WindowSharpIcon from "@mui/icons-material/WindowSharp";
import RowListings from "../../components/RowListings";
import { monthNames } from "../../utils/constants";
import Footer from "../../components/Footer";
import BusinessInfo from "../../components/BusinessInfo";
import PageControl from "../../components/PageControl";
import NotFoundAnimation from "../../components/Shared/NotFoundAnimation";
import {
  AddOutlined,
  FormatListBulleted,
  TuneOutlined,
} from "@mui/icons-material";

import Wallet from "../../components/Wallet";
import TransactionHistory from "../../components/Transactionhistory";

function tabs(path) {
  if (path == "/wishlist") return "wishlist";
  if (path == "/profile") return "ads";
  else return "ads";
}

function Profile() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [viewMode, setViewMode] = useState("rows");
  const [edit, setEdit] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [tab, setTab] = useState(tabs(location.pathname));
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  const [pageUA, setPageUA] = useState(1);
  const [pageWL, setPageWL] = useState(1);
  const [countUA, setCountUA] = useState(0);
  const [countWL, setCountWL] = useState(0);
  const [loadingUA, setLoadingUA] = useState(false);
  const [loadingWL, setLoadingWL] = useState(false);

  const navigate = useNavigate();
  let params = useParams();

  const currentUser = useSelector((state) => state.auth);

  async function fetchUser() {
    setUser((await axios.get(apis.getUser + params.id)).data);
  }

  useEffect(() => {
    if (!currentUser && !params.id) navigate("/");
    if (!params.id) setUser(currentUser);
    else fetchUser();
  }, [currentUser]);

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
        limit: 24,
        count: true,
        category: "All Categories",
        ignoreStatus: !params.id ? true : false,
        restrictCountry: true,
      })
    ).data;

    setListings(results);
    setCountUA(total);
    setLoadingUA(false);
  }

  async function getWishlist() {
    if (!user || user?._id != currentUser?._id) return;
    setLoadingWL(true);
    const { results, total } = (
      await axios.post(apis.search, {
        additional: { _id: user?.data.wishlist },
        sort: null,
        page: pageWL,
        limit: 24,
        count: true,
        category: "All Categories",
      })
    ).data;

    setWishlist(results);
    setCountWL(total);
    setLoadingWL(false);
  }

  useEffect(() => {
    setListings([]);
    getUserAds();
  }, [user, pageUA]);
  useEffect(() => {
    setWishlist([]);
    getWishlist();
  }, [user, pageWL]);

  useEffect(() => {
    setTab(tabs(location.pathname));
  }, [location]);

  return (
    <>
      {user && (
        <>
          <Navbar white={true} topOnly={true}></Navbar>
          <div className="profile_container">
            <div className="blob_1"></div>
            <div className="blob_2"></div>
            {/* <div className="profile_main"> */}
            <div className="main">
              <div className="left">
                {user?._id == currentUser?._id && <Wallet />}
                <div className="profile">
                  <div className="profile_image">
                    <div className="online_dot"></div>
                    <div className="profile_image_main">
                      <img src={user?.image} alt="" />
                    </div>
                  </div>
                  <div className="profile_info">
                    <div className="name">
                      {user?.firstName} {user?.lastName}
                      <br />
                      <span className="nickname">
                        {user?.info?.nickname &&
                          " (" + user?.info.nickname + ")"}
                      </span>
                    </div>

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
                        <LocalPhoneOutlinedIcon></LocalPhoneOutlinedIcon>{" "}
                        Contact No.
                      </span>
                      {user?.info?.phone
                        ? user?.info?.phone.slice(0, 3) +
                          " " +
                          user?.info?.phone.slice(3, 6) +
                          " " +
                          user?.info?.phone.slice(6, 10)
                        : "No data"}
                    </div>
                    <div className="info_line">
                      <span>
                        {" "}
                        <FmdGoodOutlinedIcon />
                        Location
                      </span>
                      {user?.info?.city
                        ? user?.info?.city + ", " + user?.info?.province
                        : "No data"}
                    </div>
                    <div className="info_line">
                      <span>
                        {" "}
                        <GridViewOutlinedIcon />
                        Ads posted
                      </span>
                      {user?.data?.postedAds?.total || 0}
                    </div>
                    {!params.id && (
                      <>
                        <hr />

                        <div className="actions">
                          <button
                            className="btn_classic"
                            onClick={() => setEdit(true)}
                          >
                            <ModeEditOutlineOutlinedIcon />
                            Edit Profile Info{" "}
                          </button>
                          <button
                            className="btn_classic"
                            onClick={() => setShowBusinessForm(true)}
                          >
                            <ModeEditOutlineOutlinedIcon />
                            Edit Business Info{" "}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="user_ads">
                <div className="user_ads_heading">
                  {!params.id ? (
                    <div className="tabs">
                      <h2
                        className={tab == "wishlist" ? "active" : ""}
                        onClick={(e) => setTab("wishlist")}
                      >
                        Saved Ads
                      </h2>
                      <h2
                        className={tab == "ads" ? "active" : ""}
                        onClick={(e) => setTab("ads")}
                      >
                        My Ads
                      </h2>
                    </div>
                  ) : (
                    <div className="tabs">
                      <h2 className={tab == "ads" ? "active" : ""}>
                        {user?.firstName}'s Ads
                      </h2>
                    </div>
                  )}

                  <div className="tabs manageAds">
                    <h2 className="" onClick={() => navigate("/ads")}>
                      <TuneOutlined /> Manage Ads
                    </h2>
                  </div>
                  <div className="tabs manageAds">
                    <h2 className="" onClick={() => setShowTransactions(true)}>
                      <FormatListBulleted /> My Payments
                    </h2>
                  </div>
                  <hr />
                  <div className="display_type">
                    <div
                      onClick={(e) => setViewMode("rows")}
                      className={
                        "rows_btn" + (viewMode == "rows" ? " active" : "")
                      }
                    >
                      <TableRowsSharpIcon />
                    </div>
                    <div
                      onClick={(e) => setViewMode("grid")}
                      className={
                        "grid_btn" + (viewMode == "grid" ? " active" : "")
                      }
                    >
                      <WindowSharpIcon />
                    </div>
                  </div>
                </div>

                {viewMode == "grid" && (
                  <Listings
                    listings={tab == "ads" ? listings : wishlist}
                    actions={tab == ("wishlist" || params.id) ? false : true}
                    setListings={tab == "wishlist" ? setWishlist : setListings}
                    loading={tab == "ads" ? loadingUA : loadingWL}
                  />
                )}
                {tab == "ads" && !loadingUA && !listings?.length && (
                  <div className="no_results">
                    <NotFoundAnimation />
                    <h3>
                      {user?._id == currentUser?._id
                        ? "You have not"
                        : user?.firstName + "has not posted"}{" "}
                      posted any Ads yet.
                    </h3>
                  </div>
                )}
                {viewMode == "rows" && (
                  <RowListings
                    listings={tab == "ads" ? listings : wishlist}
                    actions={tab == "wishlist" || params.id ? false : true}
                    setListings={tab == "wishlist" ? setWishlist : setListings}
                    loading={tab == "ads" ? loadingUA : loadingWL}
                  />
                )}
                {tab == "wishlist" && !loadingWL && !wishlist?.length && (
                  <div className="no_results">
                    <NotFoundAnimation />
                    <h3>You havent saved any Ads yet. </h3>
                  </div>
                )}
                {tab == "ads" && Boolean(listings?.length) && (
                  <PageControl
                    page={pageUA}
                    setPage={setPageUA}
                    count={countUA}
                    size={24}
                  />
                )}
                {tab == "wishlist" && Boolean(wishlist?.length) && (
                  <PageControl
                    page={pageWL}
                    setPage={setPageWL}
                    count={countWL}
                    size={24}
                  />
                )}
              </div>
            </div>
            <Footer />
          </div>
          {/* profile edit modal */}
          {edit && (
            <Modal close={() => setEdit(false)} className={"profile"}>
              {<UpdateProfile user={user} close={() => setEdit(false)} />}
            </Modal>
          )}
          {showBusinessForm && (
            <Modal close={() => setShowBusinessForm(false)}>
              <BusinessInfo
                close={() => setShowBusinessForm(false)}
              ></BusinessInfo>{" "}
            </Modal>
          )}
          {showTransactions && (
            <Modal close={() => setShowTransactions(false)}>
              <TransactionHistory close={() => setShowTransactions(false)} />
            </Modal>
          )}
        </>
      )}

      {!user && (
        <div className="logo_loader">
          <IconPlayer icon={blackAnimatedLOGO} />
        </div>
      )}
    </>
  );
}

export default Profile;
