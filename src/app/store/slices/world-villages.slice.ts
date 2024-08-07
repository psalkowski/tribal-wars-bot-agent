import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { IVillage } from '../../models/village.js';
import { Coordinate } from '../../models/coordinate.js';
import moment from 'moment';
import { parseTribalWarsUrl } from '../../service/navigation.js';
import { TribalWarsUrls } from '../../constants/urls.js';
import { parse } from 'csv-parse/sync';
import { fixTypes } from '../../utils/fix-types.js';

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
  extraReducers: (builder) => {
    builder.addCase(fetchWorldVillages.fulfilled, slice.caseReducers.setWorldVillages);
  },
});

export const { setWorldVillages } = slice.actions;

export default slice.reducer;

const getState = (state: RootState) => state.world_villages;

export const getWorldVillagesLastCheck = createSelector(getState, (state) => state.lastCheck);

export const getWorldVillages = createSelector(getState, (state) => state.villages);

export const getBarbarianVillages = createSelector(getWorldVillages, (villages) =>
  villages.filter((village) => !village.owner),
);

export const getBarbarianVillagesWithinDistance = (origin: Coordinate, distanceThreshold = 10) =>
  createSelector(getBarbarianVillages, (villages) => {
    return villages.filter((village) => {
      const villageCoordinate = new Coordinate(village.x, village.y);

      return origin.distanceTo(villageCoordinate) <= distanceThreshold;
    });
  });

export const fetchWorldVillages = createAsyncThunk('world_villages/fetchWorldVillages', async () => {
  const endpoint = parseTribalWarsUrl(TribalWarsUrls.public_villages);
  const response = await fetch(endpoint).then((res) => res.text());
  const records = parse(response, {
    columns: false,
    skip_empty_lines: true,
  });

  return records.map((record: [string, string, string, string, string, string, string]) => {
    const [village_id, name, x, y, player_id, points, rank] = record;

    return fixTypes({
      id: village_id,
      name,
      x,
      y,
      owner: player_id,
      points,
      rank,
    });
  });
});
