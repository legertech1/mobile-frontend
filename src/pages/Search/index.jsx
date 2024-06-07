import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Dropdown from "../../components/Shared/Dropdown";
import SearchIcon from "@mui/icons-material/Search";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import Arrow from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import TableRowsSharpIcon from "@mui/icons-material/TableRowsSharp";
import WindowSharpIcon from "@mui/icons-material/WindowSharp";
import Listings from "../../components/Listings";
import ClearIcon from "@mui/icons-material/Clear";
import "./index.css";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { useSelector, useDispatch } from "react-redux";

import {
  newSearch,
  changeSearch,
  removeSearch,
  modifySearch,
  loadResults,
  loadSearches,
  emptyResults,
} from "../../store/searchSlice";
import RowListings from "../../components/RowListings";
import { saveSearch, deleteSearch, me } from "../../store/authSlice";
import Modal from "../../components/Modal";

import WebLocation from "../../components/WebLocation";
import Footer from "../../components/Footer";
import PageControl from "../../components/PageControl";
import NotFoundAnimation from "../../components/Shared/NotFoundAnimation";
import CategoriesIcon from "../../assets/images/CategoriesIcon";

function SearchPage() {
  const [viewMode, setViewMode] = useState("rows");
  const inpRef = useRef();
  const dispatch = useDispatch();
  const [saved, setSaved] = useState(false);
  const { current, searches } = useSelector((state) => state.search);
  const user = useSelector((state) => state.auth);
  const categories = useSelector((state) => state.categories);
  const [showLocationModal, setShowLocationModal] = useState(false);
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
  const [page, setPage] = useState(1);
  const { selectedLocation, currentLocation } = useSelector(
    (state) => state.location
  );
  const [category, setCategory] = useState(null);

  const [filters, setFilters] = useState({
    price: {
      $lte: 9999999,
      $gte: 0,
    },
  });
  const [searchFilters, setSearchFilters] = useState({});

  useEffect(() => {
    dispatch(emptyResults());
  }, [selectedLocation, sort, searchFilters]);
  async function createNewSearch() {
    inpRef.current.value = "";
    dispatch(newSearch({ query: "" }));
    if (current === 7) dispatch(deleteSearch({ current: 0 }));
  }

  async function changeCategory(category) {
    dispatch(modifySearch({ category }));
  }
  async function changeQuery(query) {
    dispatch(modifySearch({ query }));
  }
  const showModal = () => {
    setShowLocationModal(true);
  };

  const hideModal = () => {
    setShowLocationModal(false);
  };

  useEffect(() => {
    inpRef.current.value = { ...searches[current] }.query;
    setCategory(
      categories.filter((c) => c.name == searches[current].category)[0] || null
    );

    if (searches[current]?.status == "pending") {
      const timeout = setTimeout(
        () =>
          dispatch(
            loadResults({
              search: searches[current],
              current: current,
              location: selectedLocation,
              sort: sort.value,
              filters: searchFilters,
            })
          ),
        100
      );
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [current, searches]);

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

  return (
    <div className="search_page">
      <Navbar white={true} topOnly={true} noLoc={true}></Navbar>

      <div className="search_main">
        <div className="search_inp">
          <Dropdown
            array={["All Categories", ...categories.map((item) => item.name)]}
            icons={[
              <CategoriesIcon />,
              ...categories.map((item) => <img src={item.icon}></img>),
            ]}
            value={searches[current].category}
            setValue={changeCategory}
          />
          <hr />
          <SearchIcon></SearchIcon>
          <input
            ref={inpRef}
            placeholder="Trying to find something?"
            // value={searches[current]?.query}
            onChange={(e) => {}}
            type="text"
            onKeyDown={(e) =>
              e.key == "Enter" && changeQuery(e.target.value.trim())
            }
          />
          <button onClick={(e) => changeQuery(inpRef.current.value)}>
            Search
          </button>
        </div>

        <div className="location" onClick={showModal}>
          {" "}
          <PinDropOutlinedIcon />{" "}
          <span className="location_name">
            {selectedLocation?.name || "select a Location"}
          </span>
          {selectedLocation?.radius && (
            <p className="radius">
              <hr />
              {selectedLocation.radius} km
            </p>
          )}
          <span className="arrow">
            <Arrow></Arrow>
          </span>
        </div>
      </div>

      <div className="tabs_wrapper">
        <div className="search_tabs">
          {searches.map((search, index) => {
            return (
              <div
                className={"search_tab" + (current == index ? " active" : "")}
                key={index}
                onClick={() => dispatch(changeSearch({ current: index }))}
              >
                <SearchIcon></SearchIcon>
                <p>
                  {" "}
                  <pre>{search.query || "New Search"}</pre>
                </p>
                {index !== current && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeSearch({ current: index }));
                    }}
                  >
                    <ClearIcon />
                  </button>
                )}
              </div>
            );
          })}

          <div className="search_tab add" onClick={createNewSearch}>
            <AddIcon />
          </div>
        </div>
      </div>
      <div className="search_results_header">
        <p>
          Showing results for{" "}
          <span>
            {searches[current]?.query.slice(0, 30) +
              (searches[current]?.query.length > 30 ? "..." : "") || "-"}
          </span>{" "}
        </p>

        <div>
          {" "}
          {user && (
            <div
              className={"save_search" + (saved ? " active" : "")}
              onClick={(e) => {
                saved
                  ? dispatch(
                      deleteSearch({ ...searches[current], results: [] })
                    )
                  : dispatch(saveSearch({ ...searches[current], results: [] }));
              }}
            >
              {saved ? (
                <>
                  <BookmarkOutlinedIcon />
                  Saved
                </>
              ) : (
                <>
                  <BookmarkBorderOutlinedIcon />
                  Save Search
                </>
              )}
            </div>
          )}
          <Dropdown
            subtext={"Sort By"}
            array={sortOptions}
            value={sort}
            setValue={(v) => setSort(v)}
          />
          <div className="display_type">
            <div
              onClick={(e) => setViewMode("rows")}
              className={"rows_btn" + (viewMode == "rows" ? " active" : "")}
            >
              <TableRowsSharpIcon />
            </div>
            <div
              onClick={(e) => setViewMode("grid")}
              className={"grid_btn" + (viewMode == "grid" ? " active" : "")}
            >
              <WindowSharpIcon />
            </div>
          </div>
        </div>
      </div>

      <div className="search_content">
        <div className="filters">
          <div className="heading">
            <TuneIcon /> Filters
          </div>
          <hr />
          <div className="filter">
            <div className="field">
              <h2>Min. price:</h2>
              <input
                type="number"
                value={filters?.price?.$gte}
                min={0}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    price: {
                      ...filters.price,
                      $gte: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="slider">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters?.price?.$gte}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    price: {
                      ...filters.price,
                      $gte: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
          <hr />
          <div className="filter">
            <div className="field">
              <h2>Max. price:</h2>
              <input
                type="number"
                value={filters?.price?.$lte}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    price: {
                      ...filters.price,
                      $lte: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="slider">
              <input
                type="range"
                min="0"
                max="99999"
                value={filters?.price?.$lte}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    price: {
                      ...filters.price,
                      $lte: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
          <hr />
          <div className="filter">
            <div className="field">
              <h2>Rent Term:</h2>
              <p></p>
            </div>
            <div className="terms">
              <div
                onClick={(e) =>
                  setFilters({
                    ...filters,
                    term: filters.term == "Day" ? null : "Day",
                  })
                }
                className={"term" + (filters?.term == "Day" ? " active" : "")}
              >
                Per Day
              </div>
              <div
                onClick={(e) =>
                  setFilters({
                    ...filters,
                    term: filters.term == "Month" ? null : "Month",
                  })
                }
                className={"term" + (filters?.term == "Month" ? " active" : "")}
              >
                Per Month
              </div>
              <div
                onClick={(e) =>
                  setFilters({
                    ...filters,
                    term: filters.term == "Year" ? null : "Year",
                  })
                }
                className={"term" + (filters?.term == "Year" ? " active" : "")}
              >
                Per Year
              </div>
            </div>
          </div>
          {category && (
            <div className="filter">
              <div className="field">
                <h2>Sub Category</h2>
                <p></p>
              </div>
              <Dropdown
                value={filters["meta.subCategory"] || "Any"}
                array={["Any", ...category?.subCategories.map((s) => s.name)]}
                setValue={(v) =>
                  setFilters({
                    ...filters,
                    ["meta.subCategory"]: v,
                  })
                }
              />
            </div>
          )}
          <div className="apply">
            <button
              className="reset"
              onClick={(e) => {
                setSearchFilters({
                  price: {
                    $lte: 9999999,
                    $gte: 0,
                  },
                });

                setFilters({
                  price: {
                    $lte: 9999999,
                    $gte: 0,
                  },
                });
              }}
            >
              Reset
            </button>
            <button
              className="apply"
              onClick={(e) => {
                if (filters.term == null) delete filters.term;
                if (filters["meta.subCategory"] == "Any")
                  delete filters["meta.subCategory"];
                setSearchFilters(filters);
              }}
            >
              Apply
            </button>
          </div>
        </div>
        <div className="search_results">
          {viewMode == "grid" && (
            <Listings
              listings={searches[current]?.featured.concat(
                searches[current]?.results
              )}
              loading={searches[current].status == "pending" ? true : false}
            />
          )}
          {viewMode == "rows" && (
            <RowListings
              listings={searches[current]?.featured.concat(
                searches[current]?.results
              )}
              loading={searches[current].status == "pending" ? true : false}
            ></RowListings>
          )}

          {!searches[current]?.featured?.length &&
            !searches[current]?.results?.length &&
            searches[current]?.status != "pending" && (
              <div className="no_results">
                <NotFoundAnimation />
                <h3>Whoops! No results found.</h3>
              </div>
            )}

          {Boolean(searches[current].total) && (
            <PageControl
              page={searches[current].page}
              setPage={(page) => dispatch(modifySearch({ page }))}
              count={searches[current].total}
              size={50}
            />
          )}
        </div>
      </div>
      {showLocationModal && (
        <Modal
          className={"location_modal"}
          title={"Your Location"}
          close={hideModal}
        >
          <WebLocation close={hideModal} />
        </Modal>
      )}
      <Footer></Footer>
    </div>
  );
}

export default SearchPage;
