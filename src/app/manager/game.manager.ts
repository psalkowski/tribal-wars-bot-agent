import { Service } from 'typedi';
import { dispatch } from '../store/store.js';
import { fetchAgent } from '../store/slices/agent.slice.js';
import { fetchBattleReports } from '../store/slices/battle-report.slice.js';
import { fetchFarmCommands } from '../store/slices/farm-commands.slice.js';
import { fetchWorldVillages } from '../store/slices/world-villages.slice.js';

@Service()
export class GameManager {
  async load() {
    await Promise.all([
      dispatch(fetchAgent()).unwrap(),
      dispatch(fetchBattleReports()).unwrap(),
      dispatch(fetchFarmCommands()).unwrap(),
      dispatch(fetchWorldVillages()).unwrap(),
    ]);
  }
}
