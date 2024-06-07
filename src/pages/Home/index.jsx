import React, { useEffect, useState } from "react";
import Header from "./Header";
import CTA from "./CTA";
import Listings from "../../components/Listings";
import axios from "axios";
import apis from "../../services/api";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import GridViewIcon from "@mui/icons-material/GridView";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NotFoundAnimation from "../../components/Shared/NotFoundAnimation";

function Home() {
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  const [homepageGallery, setHomepageGallery] = useState([]);
  const [listings, setListings] = useState([]);
  const [category, setCategory] = useState("All Categories");
  const [pageHG, setPageHG] = useState(1);
  const [pageRM, setPageRM] = useState(1);
  const [countRM, setCountRM] = useState(0);
  const [countHG, setCountHG] = useState(0);
  const [loadingRM, setLoadingRM] = useState(false);
  const [loadingHG, setLoadingHG] = useState(false);
  const [loadingMoreRM, setLoadingMoreRM] = useState(false);
  const [loadingMoreHG, setLoadingMoreHG] = useState(false);
  const user = useSelector((state) => state.auth);

  async function getListings() {
    const { results, total, page } = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category,
        additional: { "meta.homepageGallery": false },
        sort: {
          "meta.featured": -1,
          "meta.listingRank": -1,
        },
        limit: 20,
        page: 1,
        count: true,
        impressions: true,
        random: true,
      })
    ).data;
    setListings(results);
    setCountRM(total);
    setLoadingRM(false);
    setPageRM(page);
  }
  async function getHomepageGallery() {
    const { results, total, page } = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category,
        additional: { "meta.homepageGallery": true },
        sort: {
          "meta.featured": -1,
          "meta.listingRank": -1,
        },
        limit: 20,
        page: 1,
        count: true,
        impressions: true,
        random: true,
      })
    ).data;
    setHomepageGallery(results);
    setCountHG(total);
    setLoadingHG(false);
    setPageHG(page);
  }
  async function loadMoreHG() {
    setLoadingMoreHG(true);
    setPageHG((n) => n + 1);
    const results = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category,
        additional: { "meta.homepageGallery": true },

        sort: {
          "meta.featured": -1,
          "meta.listingRank": -1,
        },
        limit: 20,
        page: pageHG + 1,
      })
    ).data.results;
    setLoadingMoreHG(false);
    setHomepageGallery((arr) => [...arr, ...results]);
  }
  async function loadMoreRM() {
    setLoadingMoreRM(true);
    setPageRM((n) => n + 1);
    const results = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category,
        additional: { "meta.homepageGallery": false },
        sort: {
          "meta.featured": -1,
          "meta.listingRank": -1,
        },
        limit: 20,
        page: pageRM + 1,
      })
    ).data.results;
    setLoadingMoreRM(false);
    setListings((arr) => [...arr, ...results]);
  }
  useEffect(() => {
    if (selectedLocation) {
      getListings();
      getHomepageGallery();
      setLoadingHG(true);
      setLoadingRM(true);
    }
  }, [selectedLocation, category]);

  return (
    <div className="Home">
      <Header category={category} setCategory={setCategory}></Header>
      {/* display when no user logged in */}
      {!user && <CTA></CTA>}
      {/* display when no user logged in */}
      <div className="featured">
        {(loadingHG || Boolean(homepageGallery?.length)) && (
          <h1>
            <GridViewIcon />
            Homepage Gallery
          </h1>
        )}
        <Listings listings={homepageGallery} loading={loadingHG}></Listings>
        {homepageGallery.length < countHG && !loadingMoreHG && (
          <button className="load_more" onClick={() => loadMoreHG()}>
            Show more
          </button>
        )}
        {loadingMoreHG && (
          <Listings listings={[]} loading={loadingMoreHG}></Listings>
        )}
      </div>
      <div className="featured">
        {(loadingRM || Boolean(listings.length)) && (
          <h1>
            {" "}
            <GridViewIcon />
            Recommended for You{" "}
          </h1>
        )}
        <Listings listings={listings} loading={loadingRM}></Listings>
        {listings.length < countRM && !loadingMoreRM && (
          <button className="load_more" onClick={() => loadMoreRM()}>
            Show more
          </button>
        )}
        {loadingMoreRM && (
          <Listings listings={[]} loading={loadingMoreRM}></Listings>
        )}
      </div>
      {!loadingRM &&
        !loadingHG &&
        !listings.length &&
        !homepageGallery.length && (
          <div className="no_results">
            <NotFoundAnimation />
            <h3>Whoops! No results found.</h3>
          </div>
        )}

      <Footer></Footer>
    </div>
  );
}

export default Home;
