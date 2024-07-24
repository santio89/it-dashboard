import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import modalReducer from './slices/modalSlice'
import themeReducer from './slices/themeSlice'
import apiReducer from "./slices/apiSlice";
import { apiSlice } from "./slices/apiSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  modal: modalReducer,
  theme: themeReducer,
  api: apiReducer
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ["theme"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(apiSlice.middleware)
})

export const persistor = persistStore(store)