import { Service } from 'typedi';
import { dispatch } from '../store/store.js';
import { fetchBattleReports } from '../store/slices/battle-report.slice.js';

@Service()
export class BattleReportManager {
  async load() {
    await dispatch(fetchBattleReports()).unwrap();
  }
}
