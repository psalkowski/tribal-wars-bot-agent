import { Service } from 'typedi';
import Logger from './logger.js';
import { ScreenType } from '../constants/screen.js';
import { parseTribalWarsUrl } from '../service/navigation.js';
import { Browser } from './browser.js';
import { objectKeys } from '../utils/object.js';

@Service()
export default class Navigation {
  private readonly logger = Logger.getLogger('Navigation');

  constructor(private browser: Browser) {}

  async goToUrl(relativeUrl: string) {
    const page = await this.browser.getPage();

    return page.goto(`${this.getDomain()}${relativeUrl}`);
  }

  async goToScreen(screen: ScreenType, extraParams = {}) {
    const page = await this.browser.getPage();
    const url = new URL(this.getGameUrl(screen));

    objectKeys(extraParams).forEach((key) => {
      url.searchParams.append(key, extraParams[key]);
    });

    this.logger.debug(`Go to ${screen}`, url.toString());

    return Promise.all([
      page.waitForNavigation({
        waitUntil: 'domcontentloaded',
      }),
      page.goto(url.toString()),
    ]);
  }

  private getGameUrl(screen: ScreenType) {
    return parseTribalWarsUrl(`${this.getDomain()}/game.php?village=__village__&screen=${screen}`);
  }

  private getDomain() {
    return 'https://__world__.plemiona.pl';
  }
}
