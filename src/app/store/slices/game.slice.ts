import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { IGame } from '../../models/game.js';
import { ITribalGame } from '../../models/tribal.js';

type SliceState = IGame;

// First approach: define the initial state using that type
const initialState: SliceState = {
  RTL: false,
  csrf: '',
  device: '',
  features: {
    AccountManager: undefined,
    FarmAssistent: undefined,
    Premium: undefined,
  },
  group_id: 0,
  link_base: '',
  link_base_pure: '',
  locale: '',
  majorVersion: '',
  market: '',
  mode: undefined,
  nav: { parent: 0 },
  pregame: false,
  quest: { use_questlines: true },
  screen: '',
  time_generated: 0,
  units: [],
  version: '',
  world: '',
};

const slice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGame(state, action: PayloadAction<ITribalGame>) {
      const { player, village, ...game } = action.payload;

      return {
        ...state,
        ...game,
      };
    },
  },
});

export const { setGame } = slice.actions;

export default slice.reducer;

const getState = (state: RootState) => state.game;
