import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { PricingType } from './filtersSlice';

const API_URL = 'https://closet-recruiting-api.azurewebsites.net/api/data';

export interface ContentItem {
  id: string;
  title: string;
  price: number | null;
  pricingOption: PricingType;
  creator: string;
  imagePath: string;
}

interface ContentsState {
  items: ContentItem[];
  page: number;
  loading: boolean;
  hasMore: boolean;
  error: string | null;
}

const initialState: ContentsState = {
  items: [],
  page: 1,
  loading: false,
  hasMore: true,
  error: null,
};

// Async thunk to fetch data (infinite scroll)
export const fetchContents = createAsyncThunk<
  ContentItem[],
  void,
  { state: RootState }
>('contents/fetchContents', async (_, { getState, rejectWithValue }) => {
  try {
    const { contents, filters } = getState();

    const response = await axios.get<ContentItem[]>(API_URL);
    let data = response.data;

    // 🔍 Keyword Filter
    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          item.creator.toLowerCase().includes(keyword)
      );
    }

    // 💲 Pricing Filter
    if (filters.pricing.length > 0) {
      data = data.filter((item) =>
        filters.pricing.includes(item.pricingOption)
      );
    }

    // 💰 Price Range Filter
    if (filters.pricing.includes(0)) {
      data = data.filter((item) => {
        if (item.pricingOption !== 0) return true;
        return (
          item.price! >= filters.priceRange[0] &&
          item.price! <= filters.priceRange[1]
        );
      });
    }

    // ↕️ Sorting
    if (filters.sortBy === 'Item Name') {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortBy === 'Higher Price') {
      data.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (filters.sortBy === 'Lower Price') {
      data.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }

    // 📄 Pagination logic (simulate infinite scroll)
    const perPage = 12;
    const start = (contents.page - 1) * perPage;
    const end = start + perPage;
    const paginatedData = data.slice(start, end);

    return paginatedData;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const contentsSlice = createSlice({
  name: 'contents',
  initialState,
  reducers: {
    resetContents: () => initialState,
    incrementPage: (state) => {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContents.fulfilled,
        (state, action: PayloadAction<ContentItem[]>) => {
          state.loading = false;
          state.items = [...state.items, ...action.payload];
          state.hasMore = action.payload.length > 0;
        }
      )
      .addCase(fetchContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetContents, incrementPage } = contentsSlice.actions;

export default contentsSlice.reducer;




