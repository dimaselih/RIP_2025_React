import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  search: string;
  priceFrom?: number;
  priceTo?: number;
}

const initialState: FiltersState = {
  search: '',
  priceFrom: undefined,
  priceTo: undefined,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (_state, action: PayloadAction<FiltersState>) => {
      return action.payload;
    },
    resetFilters: () => {
      return initialState;
    },
    updateFilter: (state, action: PayloadAction<{ field: keyof FiltersState; value: any }>) => {
      const { field, value } = action.payload;
      (state as any)[field] = value;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setPriceFrom: (state, action: PayloadAction<number | undefined>) => {
      state.priceFrom = action.payload;
    },
    setPriceTo: (state, action: PayloadAction<number | undefined>) => {
      state.priceTo = action.payload;
    },
  },
});

export const { setFilters, resetFilters, updateFilter, setSearch, setPriceFrom, setPriceTo } = filtersSlice.actions;
export default filtersSlice.reducer;

