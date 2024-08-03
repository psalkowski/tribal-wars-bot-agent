import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { Container } from 'typedi';
import { AgentHttp } from '../../http/agent.http.js';

type SliceState = {
  worldId: string;
  enabled: boolean;
};

// First approach: define the initial state using that type
const initialState: SliceState = {
  worldId: '',
  enabled: false,
};

const slice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setAgent: (state, action: PayloadAction<SliceState>) => {
      const { worldId, enabled } = action.payload;

      state.worldId = worldId;
      state.enabled = enabled;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerAgent.fulfilled, slice.caseReducers.setAgent);
  },
});

export const { setAgent } = slice.actions;
export default slice.reducer;

const getState = (state: RootState) => state.agent;
export const isAgentEnabled = createSelector(
  getState,
  (agent) => agent.enabled,
);
export const getWorldId = createSelector(getState, (agent) => agent.worldId);

export const registerAgent = createAsyncThunk(
  'agent/registerAgent',
  async () => {
    const http = Container.get(AgentHttp);

    await http.registerAgent();

    return http.fetchAgent();
  },
);
