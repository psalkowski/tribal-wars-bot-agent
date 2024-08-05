import { Service } from 'typedi';
import puppeteer, { VanillaPuppeteer } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import { Browser as PuppeteerBrowser, Page } from 'puppeteer';
import { getWorldId } from '../store/slices/agent.slice.js';
import { store } from '../store/store.js';
import Logger from './logger.js';

@Service()
export class Browser {
  private initialized: boolean;
  private browser: PuppeteerBrowser;
  private logger = Logger.getLogger('Browser');

  async createPage() {
    if (this.initialized) {
      this.logger.warn('Browser has been initialized. No need to initialize it again.');
      return;
    }

    if (!this.browser) {
      this.logger.debug('Create browser instance');
      this.browser = await this.createBrowser();
    }

    const page = await this.browser.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(30000);

    // await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36');
    return page;
  }

  async getPage() {
    if (!this.browser) {
      return;
    }

    const pages = await this.browser.pages();

    return [...pages].pop();
  }

  async createBrowser() {
    return (puppeteer as any)
      .use(StealthPlugin())
      .use(
        RecaptchaPlugin.default({
          provider: {
            id: '2captcha',
            token: process.env.CAPTCHA_KEY,
          },
          visualFeedback: true,
          solveInactiveChallenges: true,
        }),
      )
      .launch(this.getPuppeteerOptions() as any);
  }

  async close() {
    this.initialized = false;

    if (this.browser) {
      await this.browser.close();

      this.browser = null;
    }
  }

  async openInNewWindow(): Promise<Page> {
    const newPagePromise = new Promise((x) => this.browser.once('targetcreated', (target) => x(target.page())));

    const page = await this.getPage();

    await page.evaluate(() => window.open('about:blank', '_blank', 'location=0'));

    return newPagePromise as Promise<Page>;
  }

  getBrowser() {
    return this.browser;
  }

  getPuppeteerOptions(): Parameters<VanillaPuppeteer['launch']>[0] {
    const userDir =
      process.env.BROWSER_ONLY === '1'
        ? `storage/.browser/user-${getWorldId(store.getState())}`
        : `storage/.browser/cli-${getWorldId(store.getState())}`;

    if (process.env.HEADLESS === 'true') {
      return {
        // args: [
        //   '--mute-audio',
        //   '--no-sandbox',
        //   '--ignore-certificate-errors',
        //   '--force-device-scale-factor',
        //   '--disable-setuid-sandbox',
        //   '--disable-gpu',
        //   '--disable-gl-drawing-for-tests',
        //   '--window-size=1366,768',
        //   '--no-first-run',
        //   "--proxy-server='direct://'",
        //   '--proxy-bypass-list=*',
        //   '--disable-breakpad',
        //   '--disable-infobars',
        //   '--hide-scrollbars',
        //   '--enable-webgl',
        //   '--no-zygote',
        //   '--disable-2d-canvas-clip-aa',
        //   '--disable-features=site-per-process',
        //   '--headless',
        // ],
        headless: true,
        devtools: false,
        // ignoreDefaultArgs: true,
        defaultViewport: {
          width: 1366,
          height: 768,
        },
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        // userDataDir: userDir,
        // protocolTimeout: 90000,
        // timeout: 90000,
      };
    }

    return {
      headless: false,
      devtools: false,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      userDataDir: userDir,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-features=site-per-process',
        process.env.HEADLESS === 'true' ? '--headless' : '',
      ],
    };
  }
}
