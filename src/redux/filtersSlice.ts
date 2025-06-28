import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PricingType = 0 | 1 | 2;

export enum PricingOption {
    PAID = 0,
    FREE = 1,
    VIEW_ONLY = 2,
}

interface FiltersState {
  pricing: PricingType[];
  keyword: string;
  sortBy: 'Item Name' | 'Higher Price' | 'Lower Price';
  priceRange: [number, number]; // [min, max]
}

const initialState: FiltersState = {
  pricing: [],
  keyword: '',
  sortBy: 'Item Name',
  priceRange: [0, 999],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPricing: (state, action: PayloadAction<PricingType[]>) => {
      state.pricing = action.payload;
    },
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    setSortBy: (state, action: PayloadAction<FiltersState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setPricing,
  setKeyword,
  setSortBy,
  setPriceRange,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
