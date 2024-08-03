import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { Village } from '../../models/village.js';
import { IPlayer, IPlayerVillage } from '../../models/player.js';
import { setGame } from './game.slice.js';

type SliceState = {
  player: IPlayer;
  villages: Village[];
  village: IPlayerVillage;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  villages: [],
  player: {} as IPlayer,
  village: {} as IPlayerVillage,
};

const slice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setGame, (state, action) => {
      const { player, village } = action.payload;

      state.player = player;
      state.village = village;
    });
  },
});

export default slice.reducer;

const getState = (state: RootState) => state.player;

export const getPlayer = createSelector(getState, (state) => state.player);
export const getPlayerVillageCount = createSelector(
  getPlayer,
  (state) => state.villages,
);
export const getPlayerId = createSelector(getPlayer, (state) => state.id);
export const getPlayerVillage = createSelector(
  getState,
  (state) => state.village,
);
export const getPlayerVillageId = createSelector(
  getPlayerVillage,
  (village) => village.id,
);

// TODO check how to fetch all player villages
export const getPlayerVillages = createSelector(getState, (state) => [
  state.village,
]);
