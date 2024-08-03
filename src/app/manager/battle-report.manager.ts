import { Service } from 'typedi';
import { dispatch, store } from '../store/store.js';
import { fetchBattleReports, getLastBattleReport } from '../store/slices/battle-report.slice.js';

@Service()
export class BattleReportManager {
  async load() {
    await dispatch(fetchBattleReports()).unwrap();
  }
}
