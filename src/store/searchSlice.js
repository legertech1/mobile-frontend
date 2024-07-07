import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apis from "../services/api";
import { removeDuplicates } from "../utils/helpers";
import CategoriesIcon from "../assets/images/categoriesIcon.png";

export const defaultSearchState = {
  query: "",
  results: [],
  category: { name: "All Categories", icon: CategoriesIcon },
  status: "fulfilled",
  page: 1,
  total: 0,
};

export const loadResults = createAsyncThunk(
  "load results",
  async (
    { search, current, location, sort, filters, merge = false },
    { dispatch, getState }
  ) => {
    const results = (
      await axios.post(apis.search, {
        location,
        query: search.query,
        filters,
        category: search.category.name,
        page: search.page,
        additional: { "meta.featured": false },
        limit: 18,
        sort,
        count: true,
        impressions: true,
      })
    ).data;
    const featured = (
      await axios.post(apis.search, {
        location,
        query: search.query,
        filters,
        category: search.category.name,
        page: search.page,
        additional: { "meta.featured": true },
        limit: 6,
        sort,
        count: true,
        impressions: true,
      })
    ).data;
    const oldResults = merge ? getState().search.searches[current].results : [];

    let mergeResults = [...oldResults, ...featured.results, ...results.results];

    return {
      results: mergeResults,

      current,
      total: results.total + featured.total,
    };
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    current: 0,

    searches: [defaultSearchState],
  },
  reducers: {
    emptyResults(state, action) {
      return {
        ...state,
        searches: [
          ...state.searches.map((s) => {
            return {
              ...s,
              results: [],
              status: "pending",
              page: 1,
              total: 0,
            };
          }),
        ],
      };
    },
    newSearch(state, action) {
      const searches = [
        ...state.searches.filter((search) => search.query != ""),
        {
          ...defaultSearchState,
          query: action.payload.query,
          category: action.payload.category || {
            name: "All Categories",
            icon: CategoriesIcon,
          },
        },
      ];
      let current = searches.length - 1;

      return {
        ...state,
        current: current,

        searches: searches,
      };
    },
    modifySearch(state, action) {
      let merge = action.payload.merge || false;
      if (
        action.payload.page &&
        state.searches[state.current]?.status == "pending"
      )
        return state;
      let s = state.searches.map((search, index) => {
        if (index != state.current) return search;
        return {
          ...defaultSearchState,
          query:
            action.payload.query ||
            (action.payload.query === "" ? action.payload.query : search.query),
          category: action.payload.category || search.category,
          page: action.payload.page || 1,
          results: merge ? search.results : [],
          status: action.payload.query == "" ? "fulfilled" : "pending",
          total: action.payload.page ? search.total : 0,
        };
      });

      return {
        ...state,
        current: state.current,
        searches: s,
      };
    },

    changeSearch(state, action) {
      return {
        ...state,
        current: action.payload.current,
        searches: [...state.searches],
      };
    },

    removeSearch(state, action) {
      if (action.payload.current == 0 && state.searches.length == 1) {
        return {
          ...state,
          searches: state.searches.map((s) => defaultSearchState),
        };
      }
      return {
        ...state,
        current:
          state.current < state.searches.length - 1
            ? state.current
            : state.current - 1,
        searches: state.searches.filter((search, index) => {
          if (index == action.payload.current) return false;
          return true;
        }),
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadResults.fulfilled, (state, action) => {
      return {
        current: state.current,

        searches: state.searches.map((search, index) => {
          if (index == action.payload.current)
            return {
              ...search,
              results: [...action.payload.results],
              status: "fulfilled",
              total: action.payload.total,
            };
          return search;
        }),
      };
    });
  },
});

export const {
  newSearch,
  modifySearch,
  removeSearch,
  changeSearch,
  loadSearches,
  emptyResults,
} = searchSlice.actions;
export default searchSlice;
