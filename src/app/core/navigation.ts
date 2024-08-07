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
    const parsedUrl = this.sanitizeQueryParams(url.startsWith('http') ? url : `${this.getDomain()}${url}`);

    if (parsedUrl === page.url()) {
      return;
    }

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
      }),
      page.goto(parsedUrl),
    ]);

    if (await this.captcha.isSupported(page)) {
      await this.captcha.handle(page);
    }
  }

  async goToScreen(screen: ScreenType, extraParams = {}) {
    const page = await this.browser.getPage();
    const url = this.sanitizeQueryParams(this.getGameUrl(screen), extraParams);

    if (url === page.url()) {
      return;
    }

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
      }),
      page.goto(url),
    ]);

    if (await this.captcha.isSupported(page)) {
      await this.captcha.handle(page);
    }
  }

  private sanitizeQueryParams(url: string, params = {}) {
    const result = new URL(parseTribalWarsUrl(url));

    objectKeys(params).forEach((key) => {
      result.searchParams.append(key, params[key] || '');
    });

    for (const [key, value] of result.searchParams.entries()) {
      if (!value) {
        result.searchParams.delete(key);
      }
    }

    return result.toString();
  }

  private getGameUrl(screen: ScreenType) {
    return `${this.getDomain()}/game.php?village=__village__&screen=${screen}`;
  }

  private getDomain() {
    return 'https://__world__.plemiona.pl';
  }
}
