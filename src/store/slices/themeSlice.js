import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  light: false,
  sideExpanded: false,
  lang: "eng"
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
    }
  }
})

export const { setLight, setSideExpanded, setLang } = themeSlice.actions
export default themeSlice.reducer