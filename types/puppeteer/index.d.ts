import {Page} from 'puppeteer';

declare module "puppeteer" {
    interface Page {
        findRecaptchas();
        getRecaptchaSolutions();
        enterRecaptchaSolutions();
        solveRecaptchas();
    }
}
