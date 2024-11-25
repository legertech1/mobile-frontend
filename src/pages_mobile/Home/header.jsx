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
import { AdTypes, PriceOptions } from "../../utils/constants";
import Input from "../../components/Shared/Input";
import { Sprout } from "styled-icons/fa-solid";

function Header({
  category,
  setCategory,
  categories,
  inpRef,
  changeQuery,
  createNewSearch,
  setLoadingStates,
  setSearchFilters,
  searchFilters,
  sort,
  setSort,
  sortOptions,
}) {
  const { selectedLocation, currentLocation } = useSelector(
    (state) => state.location
  );
  const [categoryModal, setCategoryModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);
  const [locModal, setLocModal] = useState(false);
  const { current, searches } = useSelector((state) => state.search);
  const [subCategoryModal, setSubCategoryModal] = useState(false);
  const [sortModal, setSortModal] = useState(false);
  const tabsRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {}, [filtersModal]);
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
      <h1>Turn Your Assets Into Income</h1>
      <p className="desc">
        BorrowBe is a unique marketplace connecting owners who want to rent,
        lease, or finance their items with interested people.
      </p>

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
          <PinDrop /> <p>{selectedLocation?.name || "Select a location"}</p>
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
          className={"filters"}
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
            {/* <Dropdown
              subtext={"Sort By"}
              array={sortOptions}
              value={sort}
              setValue={(v) => setSort(v)}
            /> */}

            <div className="filter">
              {" "}
              <div className="sort" onClick={() => setSortModal(true)}>
                <h4>Sort By:</h4> <p>{sort?.text}</p>
                <KeyboardArrowDown />
              </div>
            </div>

            <div className="filter">
              <div className="field">
                <h2>Min. Price</h2>
                <Input
                  pretext="$"
                  type="number"
                  value={searchFilters?.price?.$gte}
                  min={0}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      price: {
                        ...searchFilters.price,
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
                  value={searchFilters?.price?.$gte}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      price: {
                        ...searchFilters.price,
                        $gte: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <br />
              <div className="field">
                <h2>Max. Price</h2>

                <Input
                  pretext="$"
                  type="number"
                  value={searchFilters?.price?.$lte}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      price: {
                        ...searchFilters.price,
                        $lte: Number(e.target.value),
                      },
                    })
                  }
                ></Input>
              </div>
              <div className="slider">
                <input
                  type="range"
                  min="0"
                  max="99999"
                  value={searchFilters?.price?.$lte}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      price: {
                        ...searchFilters.price,
                        $lte: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="filter t">
              <div className="field">
                <h2>Listing Type</h2>
                <p></p>
              </div>
              <div className="terms">
                {AdTypes.map((option) => (
                  <div
                    className={
                      "term" +
                      (searchFilters?.type &&
                      searchFilters?.type?.$in?.includes(option)
                        ? " active"
                        : "")
                    }
                    onClick={async (e) =>
                      setSearchFilters((f) => {
                        let type = f?.type?.$in?.includes(option)
                          ? {
                              $in: [...f.type?.$in?.filter((o) => o != option)],
                            }
                          : { $in: [...(f?.type?.$in || []), option] };
                        if (type.$in.length === 0) {
                          delete f.type;
                          console.log(f);
                          return { ...f };
                        } else return { ...f, type };
                      })
                    }
                  >
                    &nbsp; {option} &nbsp;
                  </div>
                ))}
              </div>
            </div>
            <div className="filter t">
              <div className="field">
                <h2>Payment Interval</h2>
                <p></p>
              </div>

              <div className="terms">
                {PriceOptions.map((option) => (
                  <div
                    className={
                      "term" +
                      (searchFilters?.term &&
                      searchFilters?.term?.$in?.includes(option)
                        ? " active"
                        : "")
                    }
                    onClick={async (e) =>
                      setSearchFilters((f) => {
                        let term = f?.term?.$in?.includes(option)
                          ? {
                              $in: [...f.term?.$in?.filter((o) => o != option)],
                            }
                          : { $in: [...(f?.term?.$in || []), option] };
                        if (term.$in.length === 0) {
                          delete f.term;
                          console.log(f);
                          return { ...f };
                        } else return { ...f, term };
                      })
                    }
                  >
                    {option == "Day" ? "Daily" : option + "ly"}
                  </div>
                ))}
              </div>
            </div>
            {category.name && category.name != "All Categories" && (
              <div className="filter t">
                <div className="field">
                  <h2>Sub Category</h2>

                  <p></p>
                </div>
                <div className="terms">
                  {category?.subCategories.map((sc) => (
                    <div
                      className={
                        "term" +
                        (searchFilters["meta.subCategory"]?.$in?.includes(
                          sc.name
                        )
                          ? " active"
                          : "")
                      }
                      onClick={async (e) =>
                        setSearchFilters((f) => {
                          let subCategory = f[
                            "meta.subCategory"
                          ]?.$in?.includes(sc.name)
                            ? {
                                $in: [
                                  ...f["meta.subCategory"]?.$in?.filter(
                                    (o) => o != sc.name
                                  ),
                                ],
                              }
                            : {
                                $in: [
                                  ...(f["meta.subCategory"]?.$in || []),
                                  sc.name,
                                ],
                              };
                          if (subCategory.$in.length === 0) {
                            delete f["meta.subCategory"];

                            return { ...f };
                          } else
                            return { ...f, "meta.subCategory": subCategory };
                        })
                      }
                    >
                      {sc.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
      {sortModal && (
        <Modal
          heading={"Select sorting order"}
          close={(e) => setSortModal(false)}
        >
          <ModalSelector
            items={sortOptions}
            close={(e) => setSortModal(false)}
            state={sort}
            setState={(v) => {
              setSort(v);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default Header;
