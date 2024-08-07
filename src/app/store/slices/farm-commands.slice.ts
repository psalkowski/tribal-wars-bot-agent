import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { IFarmCommand, IFarmCommandPayload, IFarmCommandWithCoordinate } from '../../models/farm-command.js';
import { Container } from 'typedi';
import { FarmCommandHttp } from '../../http/farm-command.http.js';
import { Coordinate } from '../../models/coordinate.js';

type SliceState = {
  items: Array<IFarmCommand>;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  items: [],
};

const slice = createSlice({
  name: 'farm_commands',
  initialState,
  reducers: {
    setFarmCommands: (state, action: PayloadAction<IFarmCommand[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addFarmCommand.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(fetchFarmCommands.fulfilled, slice.caseReducers.setFarmCommands);
  },
});

export const { setFarmCommands } = slice.actions;
export default slice.reducer;

const getState = (state: RootState) => state.farm_commands;
export const getFarmCommands = createSelector(getState, (state): IFarmCommandWithCoordinate[] =>
  ([...state.items] || []).map((item) => ({ ...item, coordinate: new Coordinate(item.targetX, item.targetY) })),
);
export const getFarmMapByCoordinates = createSelector(
  getFarmCommands,
  (state): Record<string, IFarmCommandWithCoordinate> => {
    return state.reduce((res, farm) => {
      return {
        ...res,
        [farm.coordinate.toString()]: farm,
      };
    }, {});
  },
);

export const addFarmCommand = createAsyncThunk(
  'farm_commands/createFarmCommand',
  async (data: IFarmCommandPayload, thunkAPI) => {
    const http = Container.get(FarmCommandHttp);

    return http.create(data);
  },
);

export const fetchFarmCommands = createAsyncThunk('farm_commands/fetchFarmCommands', async () => {
  const http = Container.get(FarmCommandHttp);

  return http.fetch();
});
