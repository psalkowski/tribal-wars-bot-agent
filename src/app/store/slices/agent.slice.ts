import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { Container } from 'typedi';
import { AgentHttp } from '../../http/agent.http.js';
import moment from 'moment';
import { IAgent } from '../../models/agent.js';

type SliceState = IAgent;

// First approach: define the initial state using that type
const initialState: SliceState = {
  worldId: '',
  enabled: false,
  running: false,
  startedAt: null,
  name: '',
};

const slice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setAgent: (state, action: PayloadAction<SliceState>) => {
      const { name, worldId, enabled, startedAt, running } = action.payload;

      state.name = name;
      state.worldId = worldId;
      state.enabled = enabled;
      state.startedAt = startedAt;
      state.running = running;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerAgent.fulfilled, slice.caseReducers.setAgent);
    builder.addCase(stopAgent.fulfilled, slice.caseReducers.setAgent);
    builder.addCase(startAgent.fulfilled, slice.caseReducers.setAgent);
    builder.addCase(fetchAgent.fulfilled, slice.caseReducers.setAgent);
  },
});

export const { setAgent } = slice.actions;
export default slice.reducer;

const getState = (state: RootState) => state.agent;
export const isAgentEnabled = createSelector(getState, (agent) => agent.enabled);
export const getWorldId = createSelector(getState, (agent) => agent.worldId);

export const getStartedAt = createSelector(getState, (agent) => agent.startedAt);
export const getAgentName = createSelector(getState, (agent) => agent.name);

export const registerAgent = createAsyncThunk('agent/registerAgent', async () => {
  const http = Container.get(AgentHttp);

  await http.registerAgent();

  return http.startAgent();
});

export const fetchAgent = createAsyncThunk('agent/fetchAgent', async () => {
  const http = Container.get(AgentHttp);

  return http.fetchAgent();
});

export const stopAgent = createAsyncThunk('agent/stopAgent', async () => {
  const http = Container.get(AgentHttp);

  return http.stopAgent();
});

export const startAgent = createAsyncThunk('agent/startAgent', async () => {
  const http = Container.get(AgentHttp);

  return http.startAgent();
});
