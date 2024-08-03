import { ActionManager } from './manager/action.manager.js';
import { Game } from './game/game.js';
import { Config } from './constants/config.js';
import { FarmManager } from './manager/farm.manager.js';
import { Service } from 'typedi';
import { Page } from 'puppeteer';
import { BattleReportManager } from './manager/battle-report.manager.js';

@Service()
export class Bot {
  constructor(
    protected game: Game,
    protected farmManager: FarmManager,
    protected battleReportManager: BattleReportManager,
  ) {}

  public async run(config: Config, page: Page) {
    this.game.setConfig(config);
    this.game.setPage(page);

    await this.farmManager.load();
    await this.battleReportManager.load();

    await ActionManager.run(page);
  }
}

// todo: zrobić obsługę przechodzenia po wsyzstkich raportach w UI, zbierania danych i wysylania
// trzeba pamiętać aby nie otwierac tego samego raportu co juz byl otworzony
// nie usuwac raportow
// w BE filtrowac i zwracac tylko pojedyncze raporty na targety (ostatnie),
// reszte na razie mozna trzymac w bazie, ale nie zwracac do FE
// w FE podczas wysylania farmy sprawdzac czy dana wioska jest czysta
// (nie ma zoltej kropki albo skan wykrywa, ze mur jest niski)
