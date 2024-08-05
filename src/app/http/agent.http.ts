import { Inject, Service } from 'typedi';
import { Api } from '../core/api.js';
import { IAgent } from '../models/agent.js';

@Service()
export class AgentHttp {
  constructor(public api: Api) {}

  fetchAgent(): Promise<IAgent> {
    return this.api.get<IAgent>('/agent');
  }

  registerAgent() {
    return this.api.post('/agent', { world: process.env.WORLD });
  }

  stopAgent(): Promise<IAgent> {
    return this.api.post('/agent/stop');
  }

  startAgent(): Promise<IAgent> {
    return this.api.post('/agent/start');
  }
}
