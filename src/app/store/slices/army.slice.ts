import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { IArmy } from '../../models/army.js';
import moment from 'moment';
import { addFarmCommand } from './farm-commands.slice.js';

type SliceState = {
  army: IArmy;
  lastCheck: number;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  army: {
    spear: 0,
    sword: 0,
    axe: 0,
    archer: 0,
    spy: 0,
    light: 0,
    marcher: 0,
    heavy: 0,
    ram: 0,
    catapult: 0,
    knight: 0,
    snob: 0,
  },
  lastCheck: 0,
};

const slice = createSlice({
  name: 'army',
  initialState,
  reducers: {
    setArmy(state, action: PayloadAction<IArmy>) {
      state.army = action.payload;
      state.lastCheck = moment().valueOf();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addFarmCommand.fulfilled, (state, action) => {
      state.army.spear -= action.payload.spear;
      state.army.sword -= action.payload.sword;
      state.army.axe -= action.payload.axe;
      state.army.archer -= action.payload.archer;
      state.army.spy -= action.payload.spy;
      state.army.light -= action.payload.light;
      state.army.marcher -= action.payload.marcher;
      state.army.heavy -= action.payload.heavy;
      state.army.ram -= action.payload.ram;
      state.army.catapult -= action.payload.catapult;
    });
  },
});

export const { setArmy } = slice.actions;
export default slice.reducer;

const getState = (state: RootState) => state.army;
export const getArmy = createSelector(getState, (state) => state.army);
export const getArmyLastCheck = createSelector(
  getState,
  (state) => state.lastCheck,
);
