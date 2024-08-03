import { configureStore } from '@reduxjs/toolkit';
import game from './slices/game.slice.js';
import agent from './slices/agent.slice.js';
import player from './slices/player.slice.js';
import world_villages from './slices/world-villages.slice.js';
import farm_commands from './slices/farm-commands.slice.js';
import army from './slices/army.slice.js';
import battle_report from './slices/battle-report.slice.js';

const store = configureStore({
  reducer: {
    agent,
    army,
    game,
    player,
    world_villages,
    farm_commands,
    battle_report,
  },
  devTools: false,
  // enhancers: (getDefaultEnhancers) =>
  //   getDefaultEnhancers().concat(
  //     devToolsEnhancer({
  //       hostname: 'localhost',
  //       port: 8000,
  //       suppressConnectErrors: false,
  //     }),
  //   ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
const { dispatch } = store;

export { store, dispatch };
