import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { IVillage } from '../../models/village.js';
import { Coordinate } from '../../models/coordinate.js';
import moment from 'moment';

type SliceState = {
  villages: IVillage[];
  lastCheck: number;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  villages: [],
  lastCheck: 0,
};

const slice = createSlice({
  name: 'world_villages',
  initialState,
  reducers: {
    setWorldVillages(state, action: PayloadAction<IVillage[]>) {
      state.villages = action.payload;
      state.lastCheck = moment().valueOf();
    },
  },
});

export const { setWorldVillages } = slice.actions;

export default slice.reducer;

const getState = (state: RootState) => state.world_villages;

export const getWorldVillagesLastCheck = createSelector(
  getState,
  (state) => state.lastCheck,
);

export const getWorldVillages = createSelector(
  getState,
  (state) => state.villages,
);

export const getBarbarianVillages = createSelector(
  getWorldVillages,
  (villages) => villages.filter((village) => !village.owner),
);

export const getBarbarianVillagesWithinDistance = (
  origin: Coordinate,
  distanceThreshold = 10,
) =>
  createSelector(getBarbarianVillages, (villages) => {
    return villages.filter((village) => {
      const villageCoordinate = new Coordinate(village.x, village.y);

      return origin.distanceTo(villageCoordinate) <= distanceThreshold;
    });
  });
