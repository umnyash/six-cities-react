import { createAction } from '@reduxjs/toolkit';
import { Offers, CityName } from '../types/offers';

export const setOffers = createAction<Offers>('offers/set');
export const setCity = createAction<CityName>('catalog/setCity');
