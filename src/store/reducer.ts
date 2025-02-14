import { createReducer } from '@reduxjs/toolkit';

type InitialState = {}

const initialState: InitialState = {};

const reducer = createReducer(initialState, (builder) => { });

export { reducer };
