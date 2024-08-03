// import { CompositeAction } from './composite.action.js';;
// import { CommandArmy } from '../constants/commands.js';;
// import { Page } from 'puppeteer';
// import { Action } from '../actions/action.js';;
// import { OpenOverviewAction } from '../actions/open-overview.action.js';;
// import { ScreenType } from '../constants/screen.js';;
// import { wait } from '../utils/wait.js';;
// import { BrowserInstance } from '../browser.js';;
//
// export class AttackAction extends CompositeAction {
//     private target: string = '671|446';
//     private army: CommandArmy;
//     // private overviewAction = new OpenOverviewsVillagesAction();
//     private overviewAction = new OpenOverviewAction();
//
//     async handle(page: Page): Promise<Action> {
//         // open place
//         await this.overviewAction.handle(page);
//         const area = await page.$(`#map area[shape="poly"][href$="screen=${ScreenType.PLACE}"]`);
//         await page.evaluate(el => el.click(), area);
//         await page.waitForSelector('#command-data-form');
//
//         const pages = [
//             await this.openPage(page.url()),
//             await this.openPage(page.url()),
//             await this.openPage(page.url()),
//             await this.openPage(page.url()),
//         ];
//
//         console.log('page opened');
//
//         for(const page of pages) {
//             await page.bringToFront();
//             await this.prepareAttack(page);
//         }
//
//         console.log('pages prepared');
//
//         const attacks = [];
//         for(const page of pages) {
//             await page.bringToFront();
//             // to not wait for sending attack, click and immediately switch to another page
//             attacks.push(this.sendAttack(page));
//             await wait(50);
//         }
//
//         await Promise.all(attacks);
//
//         for (const page of pages) {
//             await page.close();
//         }
//
//         await wait(600000);
//         return null;
//     }
//
//     async openPage(url: string) {
//         const browser = BrowserInstance.getBrowser();
//         const page = await browser.newPage();
//         await page.goto(url);
//         await page.waitForSelector('#command-data-form')
//
//         return page;
//     }
//
//     async prepareAttack(page: Page) {
//         const army = {
//             spear: 2,
//             sword: 2,
//         };
//
//         await page.waitForSelector('#place_target > input');
//         await this.setValue(page, '#place_target > input', this.target);
//
//         Object
//             .keys(army)
//             .filter(name => army[name])
//             .map(async (name) => {
//                 console.log('set value', name, army[name]);
//                 await this.setValue(page, `#command-data-form input[name="${name}"]`, army[name]);
//             });
//
//         await page.click('#target_attack');
//         await page.waitForSelector('#troop_confirm_go');
//     }
//
//     async sendAttack(page: Page) {
//         await page.waitForSelector('#troop_confirm_go');
//         await page.click('#troop_confirm_go');
//     }
//
//     async isSupported(page: Page): Promise<boolean> {
//         return true;
//     }
//
//     private async setValue(page: Page, selector: string, value: any) {
//         await page.$eval(
//             selector,
//             (el: HTMLInputElement, value) => el.value = value,
//             String(value)
//         );
//     }
// }
