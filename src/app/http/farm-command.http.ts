import { Service } from 'typedi';
import { Api } from '../core/api.js';
import { IFarmCommand, IFarmCommandPayload } from '../models/farm-command.js';

@Service()
export class FarmCommandHttp {
  constructor(public api: Api) {}

  fetch(): Promise<IFarmCommand[]> {
    return this.api.get<IFarmCommand[]>('/farm-command');
  }

  create(data: IFarmCommandPayload): Promise<IFarmCommand> {
    return this.api.post<IFarmCommand>('/farm-command', data);
  }
}
