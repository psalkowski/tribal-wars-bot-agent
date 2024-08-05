import { Service } from 'typedi';
import Logger from './logger.js';
import { ScreenType } from '../constants/screen.js';
import { parseTribalWarsUrl } from '../service/navigation.js';
import { Browser } from './browser.js';
import { objectKeys } from '../utils/object.js';
import { CaptchaAction } from '../actions/captcha.action.js';

@Service()
export default class Navigation {
  private readonly logger = Logger.getLogger('Navigation');
  private captcha: CaptchaAction;

  constructor(private browser: Browser) {
    this.captcha = new CaptchaAction();
  }

  async goToUrl(url: string) {
    const page = await this.browser.getPage();
    const parsedUrl = url.startsWith('http') ? url : `${this.getDomain()}${url}`;

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
      }),
      page.goto(parseTribalWarsUrl(parsedUrl)),
    ]);

    if (await this.captcha.isSupported(page)) {
      await this.captcha.handle(page);
    }
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
        waitUntil: 'networkidle0',
      }),
      page.goto(url.toString()),
    ]);

    if (await this.captcha.isSupported(page)) {
      await this.captcha.handle(page);
    }
  }

  private getGameUrl(screen: ScreenType) {
    return parseTribalWarsUrl(`${this.getDomain()}/game.php?village=__village__&screen=${screen}`);
  }

  private getDomain() {
    return 'https://__world__.plemiona.pl';
  }
}
