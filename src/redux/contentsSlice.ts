import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './storeTypes';
import { PricingType } from './filtersSlice';

const API_URL = 'https://closet-recruiting-api.azurewebsites.net/api/data';
const PER_PAGE = 12;

export interface ContentItem {
  id: string;
  title: string;
  price: number | null;
  pricingOption: PricingType;
  creator: string;
  imagePath: string;
}

interface ContentsState {
  fullData: ContentItem[];    
  items: ContentItem[];       
  page: number;
  loading: boolean;
  hasMore: boolean;
  error: string | null;
}

const initialState: ContentsState = {
  fullData: [],
  items: [],
  page: 1,
  loading: false,
  hasMore: true,
  error: null,
};

const applyFiltersAndSort = (
  data: ContentItem[],
  filters: RootState['filters']
): ContentItem[] => {
  let filtered = [...data];

  if (filters.keyword.trim()) {
    const keyword = filters.keyword.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.creator.toLowerCase().includes(keyword)
    );
  }

  if (filters.pricing.length > 0) {
    filtered = filtered.filter((item) =>
      filters.pricing.includes(item.pricingOption)
    );
  }

  if (filters.pricing.includes(0)) {
    filtered = filtered.filter((item) => {
      if (item.pricingOption !== 0) return true;
      return (
        item.price! >= filters.priceRange[0] &&
        item.price! <= filters.priceRange[1]
      );
    });
  }

  if (filters.sortBy === 'Item Name') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filters.sortBy === 'Higher Price') {
    filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  } else if (filters.sortBy === 'Lower Price') {
    filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }

  return filtered;
};

export const fetchContents = createAsyncThunk<
  ContentItem[],
  void,
  { state: RootState }
>('contents/fetchContents', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<ContentItem[]>(API_URL);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const loadNextPage = createAsyncThunk<
  ContentItem[],
  void,
  { state: RootState }
>('contents/loadNextPage', async (_, { getState }) => {
  const state = getState();
  const { fullData, page } = state.contents;
  const filters = state.filters;

  const allFiltered = applyFiltersAndSort(fullData, filters);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  return allFiltered.slice(start, end);
});

const contentsSlice = createSlice({
  name: 'contents',
  initialState,
  reducers: {
    resetContents: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        state.loading = false;
        state.fullData = action.payload;
        state.page = 1;
        state.items = [];
        state.hasMore = true;
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadNextPage.fulfilled, (state, action) => {
        if (state.page === 1) {
          state.items = action.payload;
        } else {
          state.items = [...state.items, ...action.payload];
        }

        state.page += 1;
        state.hasMore = action.payload.length === PER_PAGE;
      });
  },
});

export const { resetContents } = contentsSlice.actions;
export default contentsSlice.reducer;
