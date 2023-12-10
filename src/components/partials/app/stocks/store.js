import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { toast } from "react-toastify";

export const stocksSlice = createSlice({
  name: "apptodo",
  initialState: {
    companyNews: [],
    symbols: [],
    news: [],
    stockGraph: { stocks: [], volumes: [], minStock: 0, maxStock: 0, maxVolume: 0 },
    filter: "all",
    symbolSearch: "",
    isLoading: false,
  },
  reducers: {
    setCompanyNews: (state, action) => {
      state.companyNews = action.payload
    },
    setNews: (state, action) => {
      state.news = action.payload
    },
    setSymbols: (state, action) => {
      state.symbols = action.payload
    },
    setStockGraph: (state, action) => {
      state.stockGraph = action.payload
    },
    setFilter: (state, action) => {
      state.symbolSearch = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCompanyNews,
  setNews,
  setSymbols,
  setStockGraph,
  setFilter,
  setIsLoading,
} = stocksSlice.actions;

export default stocksSlice.reducer;
