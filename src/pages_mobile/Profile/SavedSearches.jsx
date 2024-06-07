import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Category from "@mui/icons-material/Category";
import { newSearch } from "../../store/searchSlice";
import { useNavigate } from "react-router-dom";
import { deleteAllSearches, deleteSearch } from "../../store/authSlice";
import "./index.css";

export default function SavedSearches() {
  const user = useSelector((state) => state.auth);

  const searches = user?.data?.searches || [];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="mobile_user_profile">
      <div className="card">
        <div className="saved_head_cont">
          <h3 className="title">Your Saved Searches</h3>
          <button
            className="clear_all_btn"
            onClick={(e) => {
              dispatch(deleteAllSearches());
            }}
          >
            Clear All
          </button>
        </div>

        <div className="mobile_saved_searches">
          {searches.map((search) => (
            <div className="search_row">
              <div
                className="content"
                onClick={(e) => {
                  dispatch(newSearch({ ...search }));
                  navigate("/search");
                }}
              >
                <div className="query">
                  <SearchIcon></SearchIcon>
                  {search.query}
                </div>
              </div>
              <div className="actions">
                <button onClick={(e) => dispatch(deleteSearch(search))}>
                  <ClearIcon></ClearIcon>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
