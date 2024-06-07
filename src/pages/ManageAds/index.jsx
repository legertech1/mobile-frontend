import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import Navbar from "../../components/Navbar";
import axios from "axios";
import apis from "../../services/api";
import Dropdown from "../../components/Shared/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "../../components/Shared/Checkbox";
import { imageFallback } from "../../utils/listingCardFunctions";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import IconPlayer from "../../components/IconPlayer";
import statistics from "../../assets/animatedIcons/statistics.json";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import {
  AdsClick,
  AdsClickOutlined,
  CachedOutlined,
  CloseOutlined,
  DeleteForeverOutlined,
  EqualizerOutlined,
  MoreHorizOutlined,
  PauseOutlined,
  PinDropOutlined,
  PlayArrowOutlined,
  RemoveRedEye,
  RemoveRedEyeOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import MyAutocomplete from "../../components/Autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import parseAdressComponents from "../../utils/parseAdressComponents";
import AdLoader from "./AdLoader";
import NotFoundAnimation from "../../components/Shared/NotFoundAnimation";
import PageControl from "../../components/PageControl";
import Footer from "../../components/Footer";
import ListingsOptions from "../../components/ListingsOptions";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import LineGraph from "../../components/LineGraph";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import Modal from "../../components/Modal";
import StatsLoader from "./StatsLoader";
import Wallet from "../../components/Wallet";
import useNotification from "../../hooks/useNotification";
import { editUserData, me } from "../../store/authSlice";
import { useLocalStorage } from "@uidotdev/usehooks";
import { monthNames } from "../../utils/constants";
const dayConstant = 1000 * 60 * 60 * 24;

function duration(ad, property) {
  const _today = new Date();
  _today.setHours(0, 0, 0, 0);
  const today = _today.getTime();

  const _initialised = new Date(ad.meta.initialised);
  _initialised.setHours(0, 0, 0, 0);
  const initialised = _initialised.getTime();

  const dur =
    ad.meta["duration"] - (today / dayConstant - initialised / dayConstant);
  if (!property) return Math.floor(dur);
  if (property != "bumpUp")
    return Math.floor(
      Math.min(
        (ad.config?.current?.addOns
          ? ad.config?.current?.addOns[property]?.days || 0
          : 0) +
          (ad.config?.current?.package?.item[property] -
            (today / dayConstant - initialised / dayConstant)) || 0,
        dur
      )
    );
  return Math.floor(
    ((today - initialised) / dayConstant) %
      ad.config?.current?.addOns[property]?.frequency
  );
}
function get30DaysFromDate(localeDateString) {
  const startDate = new Date(localeDateString);
  const dates = [];

  // Iterate for 30 days and add each date to the array
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date); // Push locale string of the date
  }

  return dates;
}

const tabs = [
  "All",
  "Active",
  "Paused",
  "Highlighted",
  "Featured",
  "Homepage",
  "Expired",
];
const sorts = [
  "Highest Price",
  "Lowest Price",
  "Newest First",
  "Oldest First",
  "By Ranking",
];
function createFilter(tab) {
  let filter = {};
  switch (tab) {
    case "All":
      filter = { "meta.status": { $in: ["active", "paused", "expired"] } };
      break;
    case "Active":
      filter = { "meta.status": { $in: ["active"] } };
      break;
    case "Paused":
      filter = { "meta.status": { $in: ["paused"] } };
      break;
    case "Highlighted":
      filter = {
        "meta.status": { $in: ["active", "paused"] },
        "meta.highlighted": true,
      };
      break;
    case "Featured":
      filter = {
        "meta.status": { $in: ["active", "paused"] },
        "meta.featured": true,
      };
      break;
    case "Homepage":
      filter = {
        "meta.status": { $in: ["active", "paused"] },
        "meta.homepageGallery": true,
      };
      break;

    case "Expired":
      filter = { "meta.status": { $in: ["expired"] } };
      break;
  }
  return filter;
}

function createSort(sort) {
  let filter = {};
  switch (sort) {
    case "Highest Price":
      filter = { price: -1 };
      break;
    case "Lowest Price":
      filter = { price: +1 };
      break;
    case "Newest First":
      filter = { createdAt: -1 };
      break;
    case "Oldest First":
      filter = { createdAt: +1 };
      break;
    case "By Ranking":
      filter = { "meta.listingRank": -1 };
  }
  return filter;
}
function ManageAds() {
  const [tab, setTab] = useState("All");
  const [ads, setAds] = useState(null);
  const [count, setCount] = useState(null);
  const categories = useSelector((state) => state.categories);
  const user = useSelector((state) => state.auth);
  const [category, setCategory] = useState("All Categories");
  const [selectedAds, setSelectedAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest First");
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const confirm = useConfirmDialog();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [categoryStats, setCategoryStats] = useState(null);
  const [categoryStatsLoading, setCategoryStatsLoading] = useState(false);
  const [countData, setCountData] = useState({});
  const notification = useNotification();
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  async function batchUpdate(type, ids) {
    try {
      const res = await axios.post(apis.batchUpdate, { type, ids });
      setSelectedAds([]);
      type == "delete"
        ? dispatch(
            editUserData({
              ...user,
              data: { ...user?.data, postedAds: res.data },
            })
          )
        : loadAds(tab);
    } catch (err) {
      notification.error(err?.response?.data || err.message);
    }
  }
  const [showGraph, setShowGraph] = useState(null);

  async function loadAds(tab) {
    setSelectedAds([]);
    setSelectedAd(null);
    const filter = createFilter(tab);
    const data = (
      await axios.post(apis.search, {
        additional: {
          ...filter,
          user: [user._id],
        },
        count: true,
        ignoreStatus: true,
        query,
        location,
        category,
        page,
        limit: 16,
        sort: createSort(sort),
        analytics: true,
        restrictCountry: true,
      })
    ).data;

    setCountData(
      (await axios.post(apis.getAdsCount, { user: user?._id, category })).data
    );

    setAds(data.results);
    setCount(data.total);
    setLoading(false);
    if (data.total < (page - 1) * 20) setPage(1);
  }
  useEffect(() => {
    setLoading(true);
    loadAds(tab);
  }, [tab, location, category, page, sort, user]);
  useEffect(() => {
    if (!ads) return;
    setLoading(true);
    const timeout = setTimeout(() => {
      loadAds(tab);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    selectedAds.length && setSelectedAd(null);
  }, [selectedAds]);
  useEffect(() => {
    selectedAd && setSelectedAds([]);
  }, [selectedAd]);
  useEffect(() => {
    if (value) {
      let name = value.label;
      geocodeByAddress(value.description)
        .then((results) => {
          name = results[0].formatted_address;
          value.address_components = parseAdressComponents(
            results[0].address_components
          );
          return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
          let loc = {
            name: name,
            place_id: value.place_id,
            coordinates: {
              lat: lat,
              long: lng,
            },

            components: value.address_components,
          };

          // dispatch(setSelectedLocation({ ...loc, radius: radius }));
          setLocation(loc);
          // close();
        });
    }
  }, [value]);
  async function getStats() {
    setStatsLoading(true);
    const stats = (await axios.get(apis.getStats)).data;

    setStats({
      ...stats,
      week: {
        impressions: Object.values(stats?.impressions || {})
          .reverse()
          .slice(23)
          .reduce((acc, i) => acc + i, 0),
        clicks: Object.values(stats?.clicks || {})
          .reverse()
          .slice(23)
          .reduce((acc, i) => acc + i, 0),
        ctr: (
          (Object.values(stats?.clicks || {})
            .reverse()
            .slice(23)
            .reduce((acc, i) => acc + i, 0) /
            Object.values(stats?.impressions || {})
              .reverse()
              .slice(23)
              .reduce((acc, i) => acc + i, 0)) *
          100
        ).toFixed(2),
        diff: {
          impressions:
            Object.values(stats?.impressions || {})
              .reverse()
              .slice(23)
              .reduce((acc, i) => acc + i, 0) -
            Object.values(stats?.impressions || {})
              .reverse()
              .slice(16, 23)
              .reduce((acc, i) => acc + i, 0),
          clicks:
            Object.values(stats?.clicks || {})
              .reverse()
              .slice(23)
              .reduce((acc, i) => acc + i, 0) -
            Object.values(stats?.clicks || {})
              .reverse()
              .slice(16, 23)
              .reduce((acc, i) => acc + i, 0),
        },
      },
      month: {
        impressions: Object.values(stats?.impressions || {})
          .reverse()
          .reduce((acc, i) => acc + i, 0),
        clicks: Object.values(stats?.clicks || {})
          .reverse()
          .reduce((acc, i) => acc + i, 0),
        ctr: (
          (Object.values(stats?.clicks || {})
            .reverse()
            .reduce((acc, i) => acc + i, 0) /
            Object.values(stats?.impressions || {})
              .reverse()
              .reduce((acc, i) => acc + i, 0)) *
          100
        ).toFixed(2),
      },
    });
    setStatsLoading(false);
  }

  async function getCategoryStats(category) {
    if (!category || category == "All Categories") return;
    setCategoryStatsLoading(true);
    const stats = (
      await axios.get(
        apis.getStats + "?category=" + category.replace(" ", "%20")
      )
    ).data;
    setCategoryStats({
      ...stats,
      week: {
        impressions: Object.values(stats?.impressions || {})
          .reverse()
          .slice(23)
          .reduce((acc, i) => acc + i, 0),
        clicks: Object.values(stats?.clicks || {})
          .reverse()
          .slice(23)
          .reduce((acc, i) => acc + i, 0),
        ctr: (
          (Object.values(stats?.clicks || {})
            .reverse()
            .slice(23)
            .reduce((acc, i) => acc + i, 0) /
            Object.values(stats?.impressions || {})
              .reverse()
              .slice(23)
              .reduce((acc, i) => acc + i, 0)) *
          100
        ).toFixed(2),
        diff: {
          impressions:
            Object.values(stats?.impressions || {})
              .reverse()
              .slice(23)
              .reduce((acc, i) => acc + i, 0) -
            Object.values(stats?.impressions || {})
              .reverse()
              .slice(16, 23)
              .reduce((acc, i) => acc + i, 0),
          clicks:
            Object.values(stats?.clicks || {})
              .reverse()
              .slice(23)
              .reduce((acc, i) => acc + i, 0) -
            Object.values(stats?.clicks || {})
              .reverse()
              .slice(16, 23)
              .reduce((acc, i) => acc + i, 0),
        },
      },
      month: {
        impressions: Object.values(stats?.impressions || {})
          .reverse()
          .reduce((acc, i) => acc + i, 0),
        clicks: Object.values(stats?.clicks || {})
          .reverse()
          .reduce((acc, i) => acc + i, 0),
        ctr: (
          (Object.values(stats?.clicks || {})
            .reverse()
            .reduce((acc, i) => acc + i, 0) /
            Object.values(stats?.impressions || {})
              .reverse()
              .reduce((acc, i) => acc + i, 0)) *
          100
        ).toFixed(2),
      },
    });
    setCategoryStatsLoading(false);
  }
  const [country, setCountry] = useLocalStorage("country", null);
  useEffect(() => setLocation(null), [country]);

  // function setSize() {
  //   const elem = document.querySelector(".manage_ads .right");
  //   if (!elem) return;
  //   document.querySelector(".manage_ads .left").style.height =
  //     elem.clientHeight + "px";
  // }
  // useEffect(() => {
  //   setSize();
  //   window.onresize = setSize;
  // }, []);
  useEffect(() => {
    if (!category || category == "All Categories") return;
    getCategoryStats(category);
  }, [category, country]);
  useEffect(() => {
    getStats();
  }, [country]);

  return (
    <>
      <Navbar white={true} topOnly={true} />
      <div className="manage_ads">
        <div className="left">
          <div className="ads_header">
            <div className="tabs">
              {tabs.map((t) => (
                <div
                  className={"tab" + (t == tab ? " active" : "")}
                  onClick={() => setTab(t)}
                >
                  {t} <span>{countData[t] || 0}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ads">
            {selectedAds?.length == 0 && (
              <div className="top">
                <div className="query">
                  <SearchOutlined />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title or description"
                  />
                </div>
                <MyAutocomplete
                  loc={location?.name}
                  value={value}
                  setValue={setValue}
                  country={country}
                  types={["locality", "administrative_area_level_1", "country"]}
                ></MyAutocomplete>
                <Dropdown
                  value={sort}
                  setValue={(v) => setSort(v)}
                  array={sorts}
                />
              </div>
            )}
            {selectedAds?.length != 0 && (
              <div className="selected_actions">
                <p>
                  Selected <span>{selectedAds.length}</span> of{" "}
                  <span>{ads.length}</span> Ads
                </p>
                <div className="actions">
                  {" "}
                  {tab != "Expired" && tab != "Paused" && (
                    <button
                      className="pause"
                      onClick={() => {
                        confirm.openDialog(
                          "Are you sure you want to pause " +
                            selectedAds.length +
                            " ads?",
                          () => batchUpdate("pause", selectedAds)
                        );
                      }}
                    >
                      <PauseOutlined />
                      Pause
                    </button>
                  )}
                  {tab != "Expired" && tab != "Active" && (
                    <button
                      className="resume"
                      onClick={() => {
                        confirm.openDialog(
                          "Are you sure you want to resume " +
                            selectedAds.length +
                            " ads?",
                          () => batchUpdate("resume", selectedAds)
                        );
                      }}
                    >
                      <PlayArrowOutlined /> Resume
                    </button>
                  )}
                  <button
                    className="delete"
                    onClick={() => {
                      confirm.openDialog(
                        "Are you sure you want to delete " +
                          selectedAds.length +
                          " ads?",
                        () => {
                          batchUpdate("delete", selectedAds);
                        }
                      );
                    }}
                  >
                    <DeleteForeverOutlined /> Delete
                  </button>
                </div>
              </div>
            )}
            <div className="headings">
              <Checkbox
                checked={selectedAds?.length === ads?.length && ads?.length > 0}
                setChecked={(v) =>
                  v ? setSelectedAds(ads.map((a) => a._id)) : setSelectedAds([])
                }
              />
              <p className="info">Ad Info</p>
              <p className="stats">Statistics</p>
              <p className="price">Status </p>
              <p className="actions">Actions</p>
            </div>
            <div className="main">
              {!loading &&
                ads?.map((ad) => (
                  <div>
                    <div
                      className={
                        "ad a" +
                        ad._id +
                        (selectedAd?._id == ad._id ? " active" : "")
                      }
                      onClick={() => {
                        selectedAd?._id == ad._id
                          ? setSelectedAd(null)
                          : setSelectedAd(ad);
                      }}
                    >
                      <Checkbox
                        checked={selectedAds.includes(ad._id)}
                        setChecked={(v) =>
                          v
                            ? setSelectedAds([...selectedAds, ad._id])
                            : setSelectedAds([
                                ...selectedAds.filter((i) => i != ad._id),
                              ])
                        }
                      />
                      <div className="ad_info">
                        <img
                          src={ad.thumbnails[0]}
                          alt=""
                          onError={imageFallback}
                        />
                        <div>
                          <h4>{ad.title.slice(0, 200)}</h4>
                          <h5>
                            <PinDropOutlined />
                            {ad.location.name}
                          </h5>
                          <span className="price">
                            <span>${ad.price}</span>/
                            {ad.term + (ad.tax == "none" ? "" : " +" + ad.tax)}
                          </span>
                        </div>
                      </div>
                      <div className="stats">
                        <p>
                          <RemoveRedEye />
                          {ad?.analytics?.impressions
                            ? Object.keys(
                                ad?.analytics?.impressions?.byDate
                              ).reduce(
                                (acc, key) =>
                                  acc + ad?.analytics?.impressions?.byDate[key],
                                0
                              )
                            : "No data"}
                        </p>
                        <p>
                          <AdsClick />
                          {ad?.analytics?.clicks
                            ? Object.keys(ad?.analytics?.clicks?.byDate).reduce(
                                (acc, key) =>
                                  acc + ad?.analytics?.clicks?.byDate[key],
                                0
                              )
                            : "No data"}
                        </p>
                      </div>
                      <div className="status">
                        <p className={"status " + ad.meta.status}>
                          {ad.meta.status}
                        </p>
                        <p className="duration">
                          <AccessTimeOutlinedIcon />{" "}
                          {ad.meta.status == "expired" ? 0 : duration(ad)} days
                        </p>
                      </div>

                      <button className="options">
                        <ListingsOptions
                          listing={ad}
                          setListings={setAds}
                          extraFn={() => setSelectedAds([])}
                        />
                      </button>
                      <div
                        className="hover_info"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="badges">
                          {" "}
                          {ad?.meta?.featured && ad?.meta?.highlighted && (
                            <div className="badge featured">
                              Highlighted & Featured
                            </div>
                          )}
                          {ad?.meta?.featured && !ad?.meta?.highlighted && (
                            <div className="badge featured"> Featured</div>
                          )}
                          {!ad?.meta?.featured && ad?.meta?.highlighted && (
                            <div className="badge featured">Highlighted </div>
                          )}
                          {ad?.meta?.homepageGallery && (
                            <div className="badge homepage">
                              On Homepage Gallery{" "}
                            </div>
                          )}
                        </div>
                        <div className="details">
                          <p>
                            Category:{" "}
                            <span className="val">{ad.meta.category}</span>
                          </p>
                          <p>
                            Sub-category:{" "}
                            <span className="val">{ad.meta.subCategory}</span>
                          </p>
                          <p>
                            ListingID:{" "}
                            <span className="val">{ad.listingID}</span>
                          </p>
                          <p>
                            Posted On:
                            <span className="val">
                              {" "}
                              {new Date(ad?.createdAt).getDate()}{" "}
                              {monthNames[new Date(ad?.createdAt).getMonth()]}
                              {", "}
                              {new Date(ad?.createdAt).getFullYear()}
                            </span>
                          </p>

                          <p>
                            Package
                            <span
                              className={
                                "val " + ad?.config?.current?.package?.name
                              }
                            >
                              {ad?.config?.current?.package?.name}
                            </span>
                          </p>
                          <p>
                            Auto-relist status:
                            <span
                              className={
                                "val " +
                                (ad?.config?.recurring ? "active" : "inactive")
                              }
                            >
                              {" "}
                              {ad?.config?.recurring ? "active" : "inactive"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    {selectedAd?._id == ad?._id && (
                      <div className="more_info active">
                        <div className="info_row">
                          <div className="info_row_comp">
                            <span className="badges">
                              {ad?.meta.featured && (
                                <div className={"badge featured"}>
                                  Featured for {duration(ad, "featured")} days
                                </div>
                              )}
                              {ad?.meta.highlighted && (
                                <div className={"badge featured"}>
                                  Highlighted for {duration(ad, "highlighted")}{" "}
                                  days
                                </div>
                              )}

                              {ad?.meta.homepageGallery && (
                                <div className={"badge homepage"}>
                                  On Homepage Gallery for{" "}
                                  {duration(ad, "homepageGallery")} days
                                </div>
                              )}
                              {ad?.config?.current.addOns?.bumpUp && (
                                <div className={"badge homepage"}>
                                  Next bumpUp in {duration(ad, "bumpUp")} days
                                </div>
                              )}
                            </span>
                          </div>
                          <div className="info_row_comp">
                            <h4>Listing ID:</h4>
                            <span>{ad?.listingID}</span>
                          </div>
                        </div>
                        <div className="graph">
                          <LineGraph
                            // dates={Obj.keys(ad?.analytics?.impressions?.byDate)}
                            dates={get30DaysFromDate(
                              Object.keys(
                                ad?.analytics?.clicks?.byDate || {}
                              )[0]
                            ).map((k) => {
                              const str = new Date(k).toDateString();
                              return str.slice(4, str.length - 5);
                            })}
                            values={{
                              impressions: Object.values(
                                ad?.analytics?.impressions?.byDate || {}
                              ),
                              clicks: Object.values(
                                ad?.analytics?.clicks?.byDate || {}
                              ),
                              "click through rate": (() => {
                                let imp = Object.values(
                                  ad?.analytics?.impressions?.byDate || {}
                                );
                                let cli = Object.values(
                                  ad?.analytics?.clicks?.byDate || {}
                                );
                                return imp.map(
                                  (i, ind) => (cli[ind] / i) * 100 || 0
                                );
                              })(),
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              {loading && [0, 0, 0, 0, 0, 0].map(() => <AdLoader />)}
              {!loading && !ads?.length && (
                <div className="no_results">
                  <NotFoundAnimation />
                  <h3>Whoops! No results found.</h3>
                </div>
              )}
            </div>
          </div>

          <PageControl
            page={page}
            setPage={setPage}
            count={count}
            size={20}
          ></PageControl>
        </div>
        <div className="right">
          <Dropdown
            value={category}
            array={["All Categories", ...categories.map((c) => c.name)]}
            setValue={(v) => setCategory(v)}
          />
          <Wallet />
          <div className="category_stats stats">
            <div className="stats_header">
              <h2>
                <EqualizerOutlined />
                Overall Statistics
              </h2>
              <button
                className="graph reload"
                onClick={() => {
                  setShowGraph({
                    data: stats,
                    close: () => setShowGraph(null),
                  });
                }}
              >
                <QueryStatsOutlinedIcon />
              </button>
              <button className="reload" onClick={() => getStats()}>
                <CachedOutlined />
              </button>
            </div>
            {stats && !statsLoading && (
              <>
                <div className="stats_labels">
                  <span>This Week</span>
                  <span>This Month</span>
                </div>
                <div className="stats_data">
                  <div className="stats_data_comp">
                    <h4>
                      <span>
                        <RemoveRedEye />
                        Impressions
                      </span>
                    </h4>
                    <h2>
                      {stats?.week?.impressions}
                      <span
                        className={
                          stats?.week?.diff?.impressions > 0 ? "green" : "red"
                        }
                      >
                        {stats?.week?.diff?.impressions != 0 && (
                          <>
                            {" "}
                            (
                            {(stats?.week?.diff?.impressions > 0 ? "+" : "") +
                              stats?.week?.diff?.impressions}
                            )
                          </>
                        )}
                      </span>
                    </h2>
                  </div>{" "}
                  <div className="stats_data_comp">
                    <h4>
                      <span>
                        <RemoveRedEye />
                        Impressions
                      </span>
                    </h4>{" "}
                    <h2>{stats?.month?.impressions}</h2>
                  </div>
                </div>
                <div className="stats_data">
                  <div className="stats_data_comp">
                    <h4>
                      <span>
                        <AdsClickOutlined />
                        Clicks
                      </span>
                    </h4>{" "}
                    <h2>
                      {stats?.week?.clicks}{" "}
                      <span
                        className={
                          stats?.week?.diff?.clicks > 0 ? "green" : "red"
                        }
                      >
                        {stats?.week?.diff?.clicks != 0 && (
                          <>
                            {" "}
                            (
                            {(stats?.week?.diff?.clicks > 0 ? "+" : "") +
                              stats?.week?.diff?.clicks}
                            )
                          </>
                        )}
                      </span>
                    </h2>
                  </div>
                  <div className="stats_data_comp">
                    <h4>
                      <span>
                        <AdsClickOutlined />
                        Clicks
                      </span>
                    </h4>{" "}
                    <h2>{stats?.month?.clicks}</h2>
                  </div>
                </div>
                <div className="stats_data">
                  <div className="stats_data_comp">
                    <h4>
                      <span>
                        <PercentOutlinedIcon />
                        CTR
                      </span>
                    </h4>{" "}
                    <h2>{isNaN(stats?.week?.ctr) ? 0 : stats?.week?.ctr}%</h2>
                  </div>
                  <div className="stats_data_comp">
                    <h4>
                      <span>
                        <PercentOutlinedIcon />
                        CTR
                      </span>
                    </h4>{" "}
                    <h2>{isNaN(stats?.month?.ctr) ? 0 : stats?.month?.ctr}%</h2>
                  </div>
                </div>
              </>
            )}
            {statsLoading && <StatsLoader />}
          </div>
          <div className="overall_stats stats">
            <div className="stats_header">
              <h2>
                {" "}
                <EqualizerOutlined />
                Category Statistics
              </h2>
              <button
                className="reload graph"
                onClick={() => {
                  if (!categoryStats || !category) return;
                  setShowGraph({
                    data: categoryStats,
                    close: () => setShowGraph(null),
                  });
                }}
              >
                <QueryStatsOutlinedIcon />
              </button>
              <button
                className="reload"
                onClick={() => {
                  category && getCategoryStats(category);
                }}
              >
                <CachedOutlined />
              </button>
            </div>
            {categoryStats &&
              !categoryStatsLoading &&
              category != "All Categories" && (
                <>
                  <div className="stats_labels">
                    <span>This Week</span>
                    <span>This Month</span>
                  </div>
                  <div className="stats_data">
                    <div className="stats_data_comp">
                      <h4>
                        <span>
                          <RemoveRedEye />
                          Impressions
                        </span>
                      </h4>
                      <h2>
                        {categoryStats?.week?.impressions}
                        <span
                          className={
                            categoryStats?.week?.diff?.impressions > 0
                              ? "green"
                              : "red"
                          }
                        >
                          {categoryStats?.week?.diff?.impressions != 0 && (
                            <>
                              {" "}
                              (
                              {(categoryStats?.week?.diff?.impressions > 0
                                ? "+"
                                : "") + categoryStats?.week?.diff?.impressions}
                              )
                            </>
                          )}
                        </span>
                      </h2>
                    </div>{" "}
                    <div className="stats_data_comp">
                      <h4>
                        <span>
                          <RemoveRedEye />
                          Impressions
                        </span>
                      </h4>{" "}
                      <h2>{categoryStats?.month?.impressions}</h2>
                    </div>
                  </div>
                  <div className="stats_data">
                    <div className="stats_data_comp">
                      <h4>
                        <span>
                          <AdsClickOutlined />
                          Clicks
                        </span>
                      </h4>{" "}
                      <h2>
                        {categoryStats?.week?.clicks}{" "}
                        <span
                          className={
                            categoryStats?.week?.diff?.clicks > 0
                              ? "green"
                              : "red"
                          }
                        >
                          {categoryStats?.week?.diff?.clicks != 0 && (
                            <>
                              {" "}
                              (
                              {(categoryStats?.week?.diff?.clicks > 0
                                ? "+"
                                : "") + categoryStats?.week?.diff?.clicks}
                              )
                            </>
                          )}
                        </span>
                      </h2>
                    </div>
                    <div className="stats_data_comp">
                      <h4>
                        <span>
                          <AdsClickOutlined />
                          Clicks
                        </span>
                      </h4>{" "}
                      <h2>{categoryStats?.month?.clicks}</h2>
                    </div>
                  </div>
                  <div className="stats_data">
                    <div className="stats_data_comp">
                      <h4>
                        <span>
                          <PercentOutlinedIcon />
                          CTR
                        </span>
                      </h4>{" "}
                      <h2>{categoryStats?.week?.ctr}%</h2>
                    </div>
                    <div className="stats_data_comp">
                      <h4>
                        <span>
                          <PercentOutlinedIcon />
                          CTR
                        </span>
                      </h4>{" "}
                      <h2>{categoryStats?.month?.ctr}%</h2>
                    </div>
                  </div>
                </>
              )}
            {(!categoryStats || category == "All Categories") && (
              <h2 className="no_stats">
                <IconPlayer icon={statistics} />{" "}
                <p>Select a Category to view Statistics</p>
              </h2>
            )}
            {categoryStatsLoading && <StatsLoader />}
          </div>
        </div>
      </div>
      {showGraph && (
        <ShowDataModal data={showGraph.data} close={showGraph.close} />
      )}
      <Footer></Footer>
    </>
  );
}
function ShowDataModal({ graph, data, close, title }) {
  console.log(graph, data);
  return (
    <Modal close={close}>
      <div className="stats_modal">
        <LineGraph
          // dates={Obj.keys(ad?.analytics?.impressions?.byDate)}
          dates={Object.keys(data?.clicks || {})
            .reverse()
            .map((i) => {
              const str = new Date(i).toDateString();
              return str.slice(4, str.length - 5);
            })}
          values={{
            impressions: Object.values(data?.impressions || {}).reverse(),
            clicks: Object.values(data?.clicks || {}).reverse(),
            "click through rate": (() => {
              let imp = Object.values(data?.impressions || {});
              let cli = Object.values(data?.clicks || {});
              return imp.map((i, ind) => (cli[ind] / i) * 100 || 0).reverse();
            })(),
          }}
          width={1300}
          height={560}
        />
      </div>
    </Modal>
  );
}

export default ManageAds;
