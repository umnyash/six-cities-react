import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace, CITIES, SortingOption } from '../../const';
import { CityName } from '../../types/offers';
import { CatalogState } from '../../types/state';

const initialState: CatalogState = {
  city: CITIES[0],
  sorting: SortingOption.Default,
};

export const catalog = createSlice({
  name: NameSpace.Catalog,
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<CityName>) => {
      state.city = action.payload;
    },
    setSorting: (state, action: PayloadAction<SortingOption>) => {
      state.sorting = action.payload;
    }
  },
});

export const { setCity, setSorting } = catalog.actions;
