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

  async goToUrl(url: string) {
    const page = await this.browser.getPage();
    const parsedUrl = url.startsWith('http') ? url : `${this.getDomain()}${url}`;

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle2',
      }),
      page.goto(parseTribalWarsUrl(parsedUrl)),
    ]);

    await page.solveRecaptchas();
  }

  async goToScreen(screen: ScreenType, extraParams = {}) {
    const page = await this.browser.getPage();
    const url = new URL(this.getGameUrl(screen));

    objectKeys(extraParams).forEach((key) => {
      url.searchParams.append(key, extraParams[key]);
    });

    this.logger.debug(`Go to ${screen}`, url.toString());

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle2',
      }),
      page.goto(url.toString()),
    ]);
    await page.solveRecaptchas();
  }

  private getGameUrl(screen: ScreenType) {
    return parseTribalWarsUrl(`${this.getDomain()}/game.php?village=__village__&screen=${screen}`);
  }

  private getDomain() {
    return 'https://__world__.plemiona.pl';
  }
}
