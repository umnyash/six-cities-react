import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace, CITIES } from '../../const';
import { CityName } from '../../types/offers';
import { CatalogState } from '../../types/state';

const initialState: CatalogState = {
  city: CITIES[0],
};

export const catalog = createSlice({
  name: NameSpace.Catalog,
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<CityName>) => {
      state.city = action.payload;
    },
  },
});

export const { setCity } = catalog.actions;
