import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  light: true,
  sideExpanded: true,
  lang: "eng",
  filters: {
    contacts: {
      list: "all",
      charts: [],
    },
    devices: {
      list: "all",
      charts: [],
    },
    tasks: {
      list: "all",
      charts: [],
    },
    support: {
      list: "all",
      charts: [],
    },
  }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setLight: (state, action) => {
      state.light = action.payload.light
    },
    setSideExpanded: (state, action) => {
      state.sideExpanded = action.payload.sideExpanded
    },
    setLang: (state, action) => {
      state.lang = action.payload.lang
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...Object.keys(action.payload.filters).reduce((acc, key) => {
          acc[key] = {
            ...state.filters[key],
            ...action.payload.filters[key],
          };
          return acc;
        }, {}),
      };
    }
  }
})

export const { setLight, setSideExpanded, setLang, setFilters } = themeSlice.actions
export default themeSlice.reducer