import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import Header from "./header";
import apis from "../../services/api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CategoriesIcon from "../../assets/images/categoriesIcon.png";
import Listings from "../../components_mobile/listings/listings";
import {
  emptyResults,
  loadResults,
  modifySearch,
  newSearch,
} from "../../store/searchSlice";
import { deleteSearch } from "../../store/authSlice";
import debounce from "../../utils/debounce";
import throttle from "../../utils/throttle";
import Modal from "../../components_mobile/Modal";
import sortFeatured from "../../utils/sortFeatured";
export default function Home() {
  const [tab, setTab] = useState("home");

  const user = useSelector((state) => state.auth);
  const [saved, setSaved] = useState(false);
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  const { current, searches } = useSelector((state) => state.search);
  const [sort, setSort] = useState({
    text: "Most relevent",
    value: { "meta.listingRank": -1 },
  });
  const sortOptions = [
    { text: "Most relevent", value: { "meta.listingRank": -1 } },
    { text: "Newest first", value: { createdAt: -1 } },
    { text: "Oldest first", value: { createdAt: 1 } },
    { text: "Highest price", value: { price: -1 } },
    { text: "Lowest price", value: { price: 1 } },
  ];

  const [searchFilters, setSearchFilters] = useState({});
  const [showLocationModal, setShowLocationModal] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(emptyResults());
  }, [selectedLocation, sort, searchFilters]);
  async function createNewSearch() {
    inpRef.current.value = "";
    dispatch(newSearch({ query: "" }));
    // if (current === 5) dispatch(deleteSearch({ current: 0 }));
  }
  const inpRef = useRef();
  async function changeCategory(category) {
    dispatch(
      modifySearch({
        category,
        status: "pending",
      })
    );
  }
  async function changeQuery(query) {
    dispatch(modifySearch({ query, status: "pending" }));
  }
  const showModal = () => {
    setShowLocationModal(true);
  };

  const hideModal = () => {
    setShowLocationModal(false);
  };
  const categories = useSelector((state) => state.categories);
  const [homepageGallery, setHomepageGallery] = useState([]);

  const [pageHG, setPageHG] = useState(1);
  const [loadingStates, setLoadingStates] = useState({});

  const [countHG, setCountHG] = useState(0);

  const [loadingHG, setLoadingHG] = useState(false);
  const [filters, setFilters] = useState({
    price: {
      $lte: 9999999,
      $gte: 0,
    },
  });
  const [loadingMoreHG, setLoadingMoreHG] = useState(false);
  const containerRef = useRef();
  useEffect(() => {
    if (tab == "search") {
      setHomepageGallery([]);
      setPageHG(1);
      setCountHG(0);
    }
  }, [tab]);

  useEffect(() => {
    setTab(searches[current].query ? "search" : "home");
  }, [searches[current]?.query]);
  useEffect(() => {
    inpRef.current.value = searches[current].query;

    if (
      searches[current]?.status == "pending" &&
      searches[current]?.query &&
      tab == "search"
    ) {
      if (loadingStates[current]) return;

      setLoadingStates({ ...loadingStates, [current]: true });
      dispatch(
        loadResults({
          search: searches[current],
          current: current,
          location: selectedLocation,
          sort: sort.value,
          filters: searchFilters,
          merge: true,
        })
      )
        .unwrap()
        .then(() => setLoadingStates({ ...loadingStates, [current]: false }))
        .catch(() => setLoadingStates({ ...loadingStates, [current]: false }));
    }
  }, [current, tab, searches[current], searchFilters]);

  useEffect(() => {
    user?.data?.searches?.reduce((bool, item) => {
      if (
        item?.query == searches[current]?.query &&
        item?.category == searches[current].category
      )
        return true;
      return bool;
    }, false)
      ? setSaved(true)
      : setSaved(false);
  }, [user, current, searches]);
  async function loadMoreHG() {
    if (loadingMoreHG || homepageGallery.length >= countHG) return;

    setLoadingMoreHG(true);

    const results = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category: searches[current]?.category?.name || "All Categories",
        additional: { "meta.homepageGallery": true },
        filters: searchFilters,
        sort: {
          "meta.listingRank": -1,
        },
        limit: 24,
        page: pageHG + 1,
      })
    ).data.results;

    setPageHG((n) =>
      Math.ceil(countHG / 24) == n + 1 &&
      countHG > homepageGallery.length + results.length
        ? 0
        : n + 1
    );
    setLoadingMoreHG(false);
    setHomepageGallery((arr) => sortFeatured([...arr, ...results]));
  }
  async function getHomepageGallery() {
    if (loadingHG) return;
    const { results, total, page } = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category: searches[current]?.category?.name || "All Categories",
        additional: { "meta.homepageGallery": true },
        filters: searchFilters,
        sort: {
          "meta.listingRank": -1,
        },
        limit: 24,
        page: 1,
        count: true,
        impressions: true,
        random: true,
      })
    ).data;

    setHomepageGallery(sortFeatured(results));
    setCountHG(total);
    setLoadingHG(false);
    setPageHG(page);
  }
  function handleScroll() {
    if (tab == "home") {
      if (loadingHG || loadingMoreHG || countHG == homepageGallery.length)
        return;
      if (!containerRef.current) return;

      const container = containerRef.current;

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10
      ) {
        loadMoreHG();
      }
    } else {
      if (
        loadingStates[current] ||
        searches[current].total <= searches[current]?.results?.length
      )
        return;
      if (!containerRef.current) return;

      const container = containerRef.current;

      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 10 &&
        !loadingStates[current]
      ) {
        dispatch(
          modifySearch({
            page: searches[current].page + 1,
            merge: true,
          })
        );
      }
    }
  }

  useEffect(() => {
    if (selectedLocation && tab == "home") {
      setHomepageGallery([]);
      getHomepageGallery();
      setLoadingHG(true);
    }
  }, [selectedLocation, searches[current].category, tab, searchFilters]);
  return (
    <div
      className="_home"
      ref={containerRef}
      onScroll={throttle(handleScroll, 500)}
    >
      <Header
        category={searches[current].category}
        setCategory={(c) => {
          changeCategory(c);
        }}
        categories={categories}
        inpRef={inpRef}
        changeQuery={changeQuery}
        createNewSearch={createNewSearch}
        setLoadingStates={setLoadingStates}
        setSearchFilters={setSearchFilters}
        filters={filters}
        setFilters={setFilters}
      />

      {tab == "search" && (
        <div className="results">
          <Listings
            ads={searches[current]?.results}
            loading={loadingStates[current]}
            num={
              searches[current].total - searches[current]?.results?.length > 24
                ? 24
                : searches[current].total - searches[current]?.results?.length
            }
          />
        </div>
      )}
      {tab == "home" && (
        <div className="results">
          <Listings
            ads={homepageGallery}
            setAds={setHomepageGallery}
            loading={loadingHG || loadingMoreHG}
            num={24}
          />
        </div>
      )}
    </div>
  );
}
