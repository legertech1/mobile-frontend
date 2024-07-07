import {
  AddRounded,
  ArrowDownward,
  ClearRounded,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { SearchAlt } from "@styled-icons/boxicons-regular/SearchAlt";
import { PinDrop } from "@styled-icons/material-outlined/PinDrop";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Modal from "../../components_mobile/Modal";
import ModalSelector from "../../components_mobile/ModalSelector";
import React, { useEffect, useRef, useState } from "react";
import CategoriesIcon from "../../assets/images/categoriesIcon.png";
import { useDispatch, useSelector } from "react-redux";
import ripple from "../../utils/ripple";
import _Header from "../../components_mobile/Header";
import { changeSearch, removeSearch } from "../../store/searchSlice";
import WebLocation from "../../components/WebLocation";

function Header({
  category,
  setCategory,
  categories,
  inpRef,
  changeQuery,
  createNewSearch,
  setLoadingStates,
  setSearchFilters,
  filters,
  setFilters,
}) {
  const [categoryModal, setCategoryModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);
  const [locModal, setLocModal] = useState(false);
  const { current, searches } = useSelector((state) => state.search);
  const [subCategoryModal, setSubCategoryModal] = useState(false);
  const tabsRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    if (filters.term == null) delete filters.term;
    setSearchFilters(filters);
  }, [filtersModal]);
  useEffect(() => {
    if (!tabsRef.current.childNodes[current]) return;
    tabsRef.current.scrollTo({
      left: tabsRef.current.childNodes[current]?.offsetLeft - 16,
      behavior: "smooth",
    });
  }, [searches[current]]);
  return (
    <div className="header">
      <div className="header-mask"></div>
      <_Header />
      <h1>
        Own Nothing, <br />
        Use Everything.
      </h1>

      <div className="search">
        <div className="search-container">
          <SearchAlt onClick={(e) => changeQuery(inpRef.current.value)} />
          <input
            type="text"
            placeholder="Looking for something?"
            ref={inpRef}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                changeQuery(e.target.value.trim());
                inpRef.current.blur();
                window.scrollTo(0, 0);
              }
            }}
          />
        </div>
        <div
          className="filters-btn"
          onClick={(e) => {
            ripple(e, { dur: 1, cb: () => setFiltersModal(true) });
          }}
        >
          <TuneRoundedIcon />
        </div>
      </div>
      <div className="category-n-location">
        <div
          className="category"
          onClick={(e) => {
            ripple(e, { cb: () => setCategoryModal(true), dur: 1 });
          }}
        >
          {" "}
          {category?.icon && <img src={category.icon} />}
          {category?.name}
        </div>
        <div
          className="location"
          onClick={(e) => {
            ripple(e, { dur: 1, cb: () => setLocModal(true) });
          }}
        >
          <PinDrop /> Canada
        </div>
      </div>
      <div className="tabs" ref={tabsRef}>
        {searches
          .filter((s) => s.query)
          .map((s, i) => (
            <div
              className={"search_tab" + (i == current ? " active" : "")}
              key={i}
              onClick={(e) => {
                dispatch(changeSearch({ current: i }));
              }}
            >
              <p>{s.query}</p>
              {true && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeSearch({ current: i }));
                    setLoadingStates((state) => {
                      const obj = { ...state };
                      console.log(obj);
                      for (let x = i; x < 5; x++) {
                        obj[x] = obj[x + 1] || null;
                      }
                      return obj;
                    });
                  }}
                >
                  <ClearRounded />
                </button>
              )}
            </div>
          ))}

        {Boolean(searches.filter((s) => s.query).length) &&
          searches.length < 6 && (
            <div className="search_tab add_tab" onClick={createNewSearch}>
              <AddRounded />
            </div>
          )}
      </div>
      {categoryModal && (
        <Modal
          heading={"Select category"}
          close={(e) => setCategoryModal(false)}
        >
          <ModalSelector
            items={[
              { name: "All Categories", icon: CategoriesIcon },
              ...categories,
            ]}
            close={(e) => setCategoryModal(false)}
            state={category}
            setState={(v) => {
              setCategory(v);
            }}
          />
        </Modal>
      )}

      {filtersModal && (
        <Modal
          heading={
            <span>
              {" "}
              <TuneRoundedIcon />
              Search Filters
            </span>
          }
          close={(e) => {
            setFiltersModal(false);
          }}
        >
          <div className="_filters">
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
                  className={
                    "term" + (filters?.term == "Month" ? " active" : "")
                  }
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
                  className={
                    "term" + (filters?.term == "Year" ? " active" : "")
                  }
                >
                  Per Year
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {locModal && (
        <Modal
          className={"location"}
          heading={"Select search location"}
          close={() => setLocModal(false)}
        >
          <WebLocation />
        </Modal>
      )}
    </div>
  );
}

export default Header;
