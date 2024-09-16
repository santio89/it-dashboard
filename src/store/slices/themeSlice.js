import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  light: false,
  sideExpanded: false
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
    }
  }
})

export const { setLight, setSideExpanded } = themeSlice.actions
export default themeSlice.reducer