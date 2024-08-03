import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import {
  IFarmCommand,
  IFarmCommandPayload,
} from '../../models/farm-command.js';
import { Container } from 'typedi';
import { FarmCommandHttp } from '../../http/farm-command.http.js';

type SliceState = {
  items: IFarmCommand[];
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
    builder.addCase(fetchFarmCommands.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { setFarmCommands } = slice.actions;
export default slice.reducer;

const getState = (state: RootState) => state.farm_commands;
export const getFarmCommands = createSelector(
  getState,
  (state) => [...state.items] || [],
);

export const addFarmCommand = createAsyncThunk(
  'farm_commands/createFarmCommand',
  async (data: IFarmCommandPayload, thunkAPI) => {
    const http = Container.get(FarmCommandHttp);

    return http.create(data);
  },
);

export const fetchFarmCommands = createAsyncThunk(
  'farm_commands/fetchFarmCommands',
  async () => {
    const http = Container.get(FarmCommandHttp);

    return http.fetch();
  },
);
