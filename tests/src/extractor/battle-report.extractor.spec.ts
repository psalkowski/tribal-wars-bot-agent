import { BattleReportExtractor } from '../../../src/app/extractor/battle-report.extractor.js';
import * as fs from 'fs';

describe('BattleReportExtractor', () => {
  it('should parse report_001.html', () => {
    const extractor = new BattleReportExtractor();
    const content = fs.readFileSync('../../snapshots/reports/report_001.html').toString();

    console.log('extractor', extractor.extract(content));
  });
});
