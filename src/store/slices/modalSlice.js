import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: false,
  data: {},
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.active = action.payload.active
      state.data = action.payload.data
    }
  }
})

export const { setModal } = modalSlice.actions
export default modalSlice.reducer