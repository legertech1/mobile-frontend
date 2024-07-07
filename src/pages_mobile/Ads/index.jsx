import React, { useEffect, useRef, useState } from "react";
import Header from "../../components_mobile/Header";
import {
  FavoriteRounded,
  GridOnRounded,
  TableRowsRounded,
} from "@mui/icons-material";
import { SearchAlt } from "@styled-icons/boxicons-regular/SearchAlt";
import "./index.css";
import { useSelector } from "react-redux";
import axios from "axios";
import apis from "../../services/api";
import Listings from "../../components_mobile/listings/listings";
import ripple from "../../utils/ripple";
import throttle from "../../utils/throttle";
import { GridAlt } from "@styled-icons/boxicons-solid/GridAlt";
import { useNavigate } from "react-router-dom";

function Ads() {
  const [text, setText] = useState("");
  const [tab, setTab] = useState("wishlist");
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [pageUA, setPageUA] = useState(1);
  const [pageWL, setPageWL] = useState(1);
  const [countUA, setCountUA] = useState(0);
  const [countWL, setCountWL] = useState(0);
  const [loadingUA, setLoadingUA] = useState(false);
  const [loadingWL, setLoadingWL] = useState(false);
  const user = useSelector((state) => state.auth);

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
  async function getWishlist() {
    if (!user) return;
    setLoadingWL(true);
    const { results, total } = (
      await axios.post(apis.search, {
        additional: { _id: user?.data.wishlist },
        sort: null,
        page: pageWL,
        limit: 16,
        count: true,
        category: "All Categories",
      })
    ).data;

    setWishlist((state) => (pageWL > 1 ? [...state, ...results] : results));
    setCountWL(total);
    setLoadingWL(false);
  }
  useEffect(() => {
    // setListings([]);
    getUserAds();
  }, [user?._id, user?.data?.postedAds, pageUA]);
  useEffect(() => {
    // setWishlist([]);
    getWishlist();
  }, [user?._id, user?.data?.wishlist, pageWL]);

  const wlRef = useRef();
  const adsRef = useRef();
  const barRef = useRef();
  const containerRef = useRef();
  function handleScrollWL() {
    if (!wlRef.current || loadingWL || countWL <= wishlist.length) return;

    const container = wlRef.current;

    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10
    ) {
      setPageWL(pageWL + 1);
    }
  }
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
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/login");
    if (tab == "wishlist") {
      wlRef.current.style.transform = "translateX(0)";
      adsRef.current.style.transform = "translateX(100%)";
      barRef.current.style.transform = "translateX(0)";
    }
    if (tab == "ads") {
      wlRef.current.style.transform = "translateX(-100%)";
      adsRef.current.style.transform = "translateX(0)";
      barRef.current.style.transform = "translateX(100%)";
    }
  }, [tab]);
  return (
    <div className="_ads">
      <Header white={true} />
      <div className="header">
        <div className="search">
          <SearchAlt />{" "}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search by title or description"
          />
        </div>
      </div>
      <div className="controls">
        <div className="tabs">
          <div className="active_bar" ref={barRef}></div>
          <div
            className={"tab" + (tab == "wishlist" ? " active" : "")}
            onClick={(e) => {
              // ripple(e, { dur: 2 });
              setTab("wishlist");
            }}
          >
            <FavoriteRounded /> Saved Ads{" "}
            {"(" + (user?.data?.wishlist?.length || 0) + ")"}
          </div>
          <div
            className={"tab" + (tab == "ads" ? " active" : "")}
            onClick={(e) => {
              // ripple(e, { dur: 2 });
              setTab("ads");
            }}
          >
            <GridAlt /> My Ads {"(" + (user?.data?.postedAds?.total || 0) + ")"}
          </div>
        </div>
      </div>
      <div className="lists_container">
        <div
          className="wishlist"
          ref={wlRef}
          onScroll={throttle(handleScrollWL, 500)}
        >
          <Listings
            ads={wishlist.filter((ad) =>
              (ad.title + " " + ad.description).includes(text)
            )}
            setAds={setWishlist}
            loading={loadingWL}
          />
        </div>
        <div
          className="ads"
          ref={adsRef}
          onScroll={throttle(handleScrollUA, 500)}
        >
          <Listings
            ads={listings.filter((ad) =>
              (ad.title + " " + ad.description).includes(text)
            )}
            setAds={setListings}
            loading={loadingUA}
            gestures={true}
            status={true}
            update={(changes) => {
              const map = {};
              for (let c of changes) {
                map[c._id] = c;
              }
              const keys = changes.map((c) => c._id);
              setListings(
                listings.map((l) => (keys.includes(l._id) ? map[l._id] : l))
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Ads;
