import { BattleReportExtractor } from './app/extractor/battle-report.extractor.js';
import fs from 'fs';

const extractor = new BattleReportExtractor();
const content = fs.readFileSync('./snapshots/reports/report_002.html').toString();

console.log(extractor.extract(content));
