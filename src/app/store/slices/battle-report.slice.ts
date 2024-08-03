import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { Container } from 'typedi';
import { IBattleReport } from '../../models/battle-report.js';
import { BattleReportHttp } from '../../http/battle-report.http.js';
import { sortBy, SortDirection } from '../../utils/array.js';

type SliceState = {
  items: IBattleReport[];
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  items: [],
};

const slice = createSlice({
  name: 'battle_report',
  initialState,
  reducers: {
    setFarmCommands: (state, action: PayloadAction<IBattleReport[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBattleReport.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(fetchBattleReports.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default slice.reducer;

const getState = (state: RootState) => state.battle_report;
export const getLastBattleReport = createSelector(getState, (state) => {
  return ([...state.items] || []).sort(sortBy('battleAt', SortDirection.ASC)).pop();
});

export const createBattleReport = createAsyncThunk(
  'battle_report/createBattleReport',
  async (data: IBattleReport, thunkAPI) => {
    const http = Container.get(BattleReportHttp);

    return http.create(data);
  },
);

export const fetchBattleReports = createAsyncThunk('battle_report/fetchBattleReports', async () => {
  const http = Container.get(BattleReportHttp);

  return http.fetch();
});
