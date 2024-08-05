import puppeteer from 'puppeteer-extra';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';

import { getWorldId } from '../store/slices/agent.slice.js';
import { store } from '../store/store.js';
import Logger from '../core/logger.js';

class BrowserInstanceSingleton {
  private readonly logger = Logger.getLogger('Browser');
  private browser: Browser;
  private page: Page;
  private initialized = false;

  async start() {
    if (this.initialized) {
      this.logger.warn('Browser has been initialized. No need to initialize it again.');
      return;
    }

    this.browser = (await (puppeteer as any)
      .use(StealthPlugin())
      .use(
        RecaptchaPlugin.default({
          provider: {
            id: '2captcha',
            token: process.env.CAPTCHA_KEY,
          },
          visualFeedback: true,
        }),
      )
      .launch(this.getPuppeteerOptions() as any)) as Browser;

    this.page = (await this.browser.pages())[0] as Page;
    this.page.setDefaultTimeout(5000);
    this.page.setDefaultNavigationTimeout(30000);

    await this.page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36',
    );
  }

  async close() {
    this.initialized = false;

    if (this.browser) {
      await this.browser.close();
    }
  }

  async restart() {
    await this.close();
    await this.start();
  }

  async openInNewWindow(): Promise<Page> {
    const newPagePromise = new Promise((x) => this.browser.once('targetcreated', (target) => x(target.page())));

    await this.page.evaluate(() => window.open('about:blank', '_blank', 'location=0'));

    return newPagePromise as Promise<Page>;
  }

  getBrowser() {
    return this.browser;
  }

  getPage() {
    return this.page;
  }

  async goTo(url: string) {
    await this.page.goto(url, { waitUntil: 'load' });
  }

  getPuppeteerOptions() {
    const userDir =
      process.env.BROWSER_ONLY === '1'
        ? `.browser/user-${getWorldId(store.getState())}`
        : `.browser/cli-${getWorldId(store.getState())}`;

    // if (process.env.HEADLESS === "true" && process.env.BROWSER_ONLY !== "1") {
    //   return {
    //     args: [
    //       "--mute-audio",
    //       "--no-sandbox",
    //       "--ignore-certificate-errors",
    //       "--force-device-scale-factor",
    //       "--disable-setuid-sandbox",
    //       "--disable-gpu",
    //       "--disable-gl-drawing-for-tests",
    //       "--window-size=1366,768",
    //       "--no-first-run",
    //       "--proxy-server='direct://'",
    //       "--proxy-bypass-list=*",
    //       "--disable-breakpad",
    //       "--disable-infobars",
    //       "--hide-scrollbars",
    //       "--enable-webgl",
    //       "--no-zygote",
    //       "--disable-2d-canvas-clip-aa",
    //       "--disable-features=site-per-process",
    //       process.env.HEADLESS === "true" ? "--headless" : "",
    //     ],
    //     headless: process.env.HEADLESS === "true",
    //     devtools: false,
    //     ignoreDefaultArgs: true,
    //     defaultViewport: {
    //       width: 1366,
    //       height: 768,
    //     },
    //     ...(process.env.BROWSER_BIN
    //       ? { executablePath: process.env.BROWSER_BIN }
    //       : {}),
    //     userDataDir: userDir,
    //   };
    // }

    return {
      headless: false,
      devtools: false,
      defaultViewport: {},
      executablePath: process.env.BROWSER_BIN,
      userDataDir: userDir,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-features=site-per-process',
        process.env.HEADLESS === 'true' && process.env.BROWSER_ONLY !== '1' ? '--headless' : '',
      ],
      ...(process.env.BROWSER_BIN ? { executablePath: process.env.BROWSER_BIN } : {}),
    };
  }
}

const BrowserInstance = new BrowserInstanceSingleton();

export { BrowserInstance };
