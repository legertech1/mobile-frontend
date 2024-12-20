import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import Header from "./header";
import apis from "../../services/api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CategoriesIcon from "../../assets/images/categoriesIcon.png";
import Listings from "../../components_mobile/listings/listings";
import NotFoundAnimation from "../../components/Shared/NotFoundAnimation";
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
const sortOptions = [
  { text: "Most relevent", value: { "meta.listingRank": -1 } },
  { text: "Newest first", value: { createdAt: -1 } },
  { text: "Oldest first", value: { createdAt: 1 } },
  { text: "Highest price", value: { price: -1 } },
  { text: "Lowest price", value: { price: 1 } },
];
export default function Home() {
  const [tab, setTab] = useState("home");

  const user = useSelector((state) => state.auth);
  const [saved, setSaved] = useState(false);
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  const { current, searches } = useSelector((state) => state.search);
  const [sort, setSort] = useState(sortOptions[0]);

  const [searchFilters, setSearchFilters] = useState({
    price: {
      $lte: 99999999,
      $gte: 0,
    },
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (tab == "home") {
      setHomepageGallery([]);
      getHomepageGallery();
      setLoadingHG(true);
    } else dispatch(emptyResults());
  }, [sort, selectedLocation, searches[current].category, tab, searchFilters]);
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
  const [recommended, setRecommended] = useState([]);

  const [pageHG, setPageHG] = useState(1);
  const [pageRL, setPageRL] = useState(1);
  const [loadingStates, setLoadingStates] = useState({});

  const [countHG, setCountHG] = useState(0);
  const [countRL, setCountRL] = useState(null);
  const [loadingHG, setLoadingHG] = useState(false);
  const [loadingRL, setLoadingRL] = useState(false);

  const [loadingMoreHG, setLoadingMoreHG] = useState(false);
  const [loadingMoreRL, setLoadingMoreRL] = useState(false);
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
          sort: { "meta.featured": -1, ...sort.value },
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
        sort: { "meta.featured": -1, ...sort.value },
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
  async function loadMoreRL() {
    if (loadingMoreRL || recommended.length >= countRL) return;

    setLoadingMoreRL(true);

    const results = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category: searches[current]?.category?.name || "All Categories",
        additional: { "meta.homepageGallery": false },
        filters: searchFilters,
        sort: { "meta.featured": -1, ...sort.value },
        limit: 24,
        page: pageRL + 1,
      })
    ).data.results;

    setPageRL((n) =>
      Math.ceil(countRL / 24) == n + 1 &&
      countRL > recommended.length + results.length
        ? 0
        : n + 1
    );
    setLoadingMoreRL(false);
    setRecommended((arr) => sortFeatured([...arr, ...results]));
  }
  async function getHomepageGallery() {
    if (loadingHG) return;
    const { results, total, page } = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category: searches[current]?.category?.name || "All Categories",
        additional: { "meta.homepageGallery": true },
        filters: searchFilters,
        sort: { "meta.featured": -1, ...sort.value },
        limit: 24,
        page: 1,
        count: true,
        impressions: true,
        random: true,
      })
    ).data;

    setHomepageGallery(sortFeatured(results));
    if (results.length == 0) getRecommended();
    setCountHG(total);
    setLoadingHG(false);
    setPageHG(page);
  }
  async function getRecommended() {
    if (loadingRL) return;
    const { results, total, page } = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category: searches[current]?.category?.name || "All Categories",
        additional: { "meta.homepageGallery": false },
        filters: searchFilters,
        sort: { "meta.featured": -1, ...sort.value },
        limit: 24,
        page: 1,
        count: true,
        impressions: true,
        random: true,
      })
    ).data;

    setRecommended(sortFeatured(results));
    setCountRL(total);
    setLoadingRL(false);
    setPageRL(page);
  }
  function handleScroll() {
    if (tab == "home") {
      if (
        loadingHG ||
        loadingRL ||
        loadingMoreHG ||
        loadingMoreRL ||
        (countHG == homepageGallery.length &&
          countRL != null &&
          countRL == recommended.length)
      )
        return;

      if (!containerRef.current) return;

      const container = containerRef.current;

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10
      ) {
        if (countHG > homepageGallery.length) loadMoreHG();
        else if (countRL === null) {
          setLoadingRL(true);
          getRecommended();
        } else loadMoreRL();
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
        searchFilters={searchFilters}
        sort={sort}
        setSort={setSort}
        sortOptions={sortOptions}
      />

      {tab == "search" && (
        <>
          <div className="results">
            <Listings
              ads={searches[current]?.results}
              loading={loadingStates[current]}
              num={
                searches[current].total - searches[current]?.results?.length >
                24
                  ? 24
                  : searches[current].total - searches[current]?.results?.length
              }
            />
          </div>
          {!Boolean(searches[current]?.results?.length) &&
            !loadingStates[current] && (
              <>
                <NotFoundAnimation />
                <h3 className="_not_found">Whoops! No results found.</h3>
              </>
            )}
        </>
      )}
      {tab == "home" && (
        <>
          <div className="results">
            <Listings
              ads={[...homepageGallery, ...recommended]}
              setAds={setHomepageGallery}
              loading={loadingHG || loadingMoreHG || loadingRL || loadingMoreRL}
              num={24}
            />
          </div>
          {!homepageGallery.length &&
            !recommended.length &&
            !loadingMoreHG &&
            !loadingHG &&
            !loadingMoreRL &&
            !loadingRL && (
              <>
                <NotFoundAnimation />
                <h3 className="_not_found">Whoops! No results found.</h3>
              </>
            )}
        </>
      )}
    </div>
  );
}
