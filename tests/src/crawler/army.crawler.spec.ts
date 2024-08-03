import { ArmyCrawler } from '../../../src/crawler/army.crawler';
import * as path from 'path';
import { readFileSync } from 'fs';


describe('ArmyCrawler', () => {
    describe('crawl()', () => {
        test('should crawl data from train screen', async () => {
            const html = readFileSync(path.join(__dirname, '../../snapshots/rekrutacja.html')).toString();
            const crawler = new ArmyCrawler();
            const result = await crawler.crawl(html);

            expect(result).toEqual({
                spear: { unit: 'spear', available: 0, total: 200 },
                sword: { unit: 'sword', available: 0, total: 200 },
                axe: { unit: 'axe', available: 2, total: 1344 },
                ram: { unit: 'ram', available: 4, total: 98 },
                catapult: { unit: 'catapult', available: 63, total: 63 }
            });
        });

        test('should crawl data from farm assistant', async () => {
            const html = readFileSync(path.join(__dirname, '../../snapshots/asystent-farmera.html')).toString();
            const crawler = new ArmyCrawler();
            const result = await crawler.crawl(html);

            expect(result).toEqual({
                spear: { unit: 'spear', available: 100, total: 100 },
                sword: { unit: 'sword', available: 100, total: 100 },
                axe: { unit: 'axe', available: 140, total: 140 },
                spy: { unit: 'spy', available: 222, total: 222 },
                archer: { unit: 'archer', available: 0, total: 0 },
                marcher: { unit: 'marcher', available: 0, total: 0 },
                heavy: { unit: 'heavy', available: 0, total: 0 },
                light: { unit: 'light', available: 8, total: 8 },
                knight: { unit: 'knight', available: 1, total: 1 },
            });
        });
    });

    describe('isSupported()', () => {
        test('should pass false when no params', async () => {
            const crawler = new ArmyCrawler();

            expect(await crawler.isSupported('http://example.com')).toBeFalsy();
        });

        test('should pass false when screen param is different than `train`', async () => {
            const crawler = new ArmyCrawler();

            expect(await crawler.isSupported('http://example.com?screen=overview')).toBeFalsy();
        });

        test('should pass true when screen param is equal to `train`', async () => {
            const crawler = new ArmyCrawler();

            expect(await crawler.isSupported('http://example.com?screen=train')).toBeTruthy();
        });
    });
});

