import { ActionManager } from './manager/action.manager.js';
import { Game } from './game/game.js';
import { Config } from './constants/config.js';
import { Service } from 'typedi';
import { Page } from 'puppeteer';
import { GameManager } from './manager/game.manager.js';

@Service()
export class Bot {
  constructor(protected game: Game, protected gameManager: GameManager, protected actionManager: ActionManager) {}

  public async run(config: Config, page: Page) {
    this.game.setConfig(config);
    this.game.setPage(page);

    await this.gameManager.load();
    await this.actionManager.run(page);
  }
}

// todo: zrobić obsługę przechodzenia po wsyzstkich raportach w UI, zbierania danych i wysylania
// trzeba pamiętać aby nie otwierac tego samego raportu co juz byl otworzony
// nie usuwac raportow
// w BE filtrowac i zwracac tylko pojedyncze raporty na targety (ostatnie),
// reszte na razie mozna trzymac w bazie, ale nie zwracac do FE
// w FE podczas wysylania farmy sprawdzac czy dana wioska jest czysta
// (nie ma zoltej kropki albo skan wykrywa, ze mur jest niski)
