import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apis from "../services/api";
import { removeDuplicates } from "../utils/helpers";

export const defaultSearchState = {
  query: "",
  results: [],
  category: "All Categories",
  status: "pending",
  featured: [],
  page: 1,
  total: null,
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
        category: search.category,
        page: search.page,
        additional: { "meta.featured": false },
        limit: 36,
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
        category: search.category,
        page: search.page,
        additional: { "meta.featured": true },
        limit: 9,
        sort,
        count: true,
        impressions: true,
      })
    ).data;
    const oldResults = merge ? getState().search.searches[current].results : [];

    const oldFeatured = merge
      ? getState().search.searches[current].featured
      : [];

    let mergeResults = removeDuplicates(
      [...oldResults, ...results.results],
      "_id"
    );
    let mergeFeatured = removeDuplicates(
      [...oldFeatured, ...featured.results],
      "_id"
    );
    return {
      results: mergeResults,
      featured: mergeFeatured,
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
              featured: [],
              status: "pending",
              page: 1,
              total: null,
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
          category: action.payload.category || "All Categories",
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
      let s = state.searches.map((search, index) => {
        if (index != state.current) return search;
        return {
          ...defaultSearchState,
          query:
            action.payload.query ||
            (action.payload.query === "" ? action.payload.query : search.query),
          category: action.payload.category || search.category,
          page: action.payload.page || search.page,
          results: merge ? search.results : [],
          featured: merge ? search.featured : [],
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
              featured: [...action.payload.featured],
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
