import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { AnyNode, Cheerio, CheerioAPI } from 'cheerio';
import { fixTypes } from '../utils/fix-types.js';
import { getQueryParams } from '../utils/query.js';
import moment from 'moment/moment.js';
import { FightStatus, IBattleReport } from '../models/battle-report.js';
import { Service } from 'typedi';

const ReportUI = {
  REPORT_ELEMENT: '.report_ReportAttack',
  ATTACKER_INFO_TABLE: '#attack_info_att',
  ATTACKER_UNIT_TABLE: '#attack_info_att_units',
  DEFENDER_INFO_TABLE: '#attack_info_def',
  DEFENDER_UNIT_TABLE: '#attack_info_def_units',
  ATTACK_LUCK_TABLE: '#attack_luck',
  ATTACK_RESULT_TABLE: '#attack_results',
};

@Service()
export class BattleReportExtractor {
  extract(content: string): IBattleReport {
    const $ = cheerio.load(content);
    const $element = $(ReportUI.REPORT_ELEMENT).first();

    const attackerArmy = this.scrapeArmy($, $element, ReportUI.ATTACKER_UNIT_TABLE);
    const defenderArmy = this.scrapeArmy($, $element, ReportUI.DEFENDER_UNIT_TABLE);
    const luck = this.scrapeLuck($, $element);
    const loot = this.scrapeLoot($, $element);
    const origin = this.scrapePlayerAndVillage($, $element, ReportUI.ATTACKER_INFO_TABLE);
    const destination = this.scrapePlayerAndVillage($, $element, ReportUI.DEFENDER_INFO_TABLE);
    const battleAt = this.scrapeBattleAt($, $element);
    const status = this.scrapeStatus($, $element);
    const id = this.scrapeReportId($);

    return fixTypes({
      origin,
      destination,
      attackerArmy,
      defenderArmy,
      luck,
      loot,
      battleAt,
      status,
      id,
    });
  }

  scrapeReportId($: CheerioAPI) {
    const link = $('a[href*="del_one"]').first().attr('href');
    const params = getQueryParams(link);

    return params.id;
  }

  scrapePlayerAndVillage($: CheerioAPI, $element: Cheerio<AnyNode>, tableId: string) {
    let destinationLink = $element.find(`${tableId} .village_anchor`);
    let destCoords = destinationLink.text().match(/\((-*\d+)\|(-*\d+)\)/i);

    return {
      villageId: destinationLink.attr('data-id') || '',
      playerId: destinationLink.attr('data-player') || '',
      x: destCoords ? destCoords[1] : '',
      y: destCoords ? destCoords[2] : '',
    };
  }

  scrapeLuck($: CheerioAPI, $element: Cheerio<AnyNode>) {
    const $table = $element.find(ReportUI.ATTACK_LUCK_TABLE);
    const luck = $table.find('tr:nth-child(1)').text().trim();

    return parseFloat(luck);
  }

  scrapeLoot($: CheerioAPI, $element: Cheerio<AnyNode>) {
    const lootTable = $element.find(ReportUI.ATTACK_RESULT_TABLE);
    const loot = {
      wood: lootTable.find('.wood').parent().text().trim(),
      stone: lootTable.find('.stone').parent().text().trim(),
      iron: lootTable.find('.iron').parent().text().trim(),
      total: '',
      capacity: '',
    };

    const lootInfo = lootTable.find('tr:last-child td:last-child').text().split('/');

    loot.total = lootInfo[0].trim();
    loot.capacity = lootInfo[1] ? lootInfo[1].trim() : '';

    return loot;
  }

  scrapeStatus($: CheerioAPI, $element: Cheerio<AnyNode>): FightStatus {
    const href = $element.closest('table').find('> tbody > tr:nth-child(1) > th:nth-child(2) > img').attr('src');
    const image = href.split('/').pop();

    return {
      'green.png': FightStatus.CLEAN,
      'blue.png': FightStatus.SCAN,
      'yellow.png': FightStatus.PARTIAL_LOSE,
      'red.png': FightStatus.FULL_LOSE,
    }[image];
  }

  scrapeBattleAt($: CheerioAPI, $element: Cheerio<AnyNode>) {
    const time = $element.closest('table').find('> tbody > tr:nth-child(2) > td:nth-child(2)').text().trim();

    return moment(time, 'DD.MM.YY HH:mm:ss.SSS').valueOf();
  }

  scrapeArmy($: CheerioAPI, $element: Cheerio<AnyNode>, tableId: string) {
    const $unitTable = $element.find(tableId);
    const $unitTypesRow = $unitTable.find('tr:nth-child(1)');
    const $unitsSentRow = $unitTable.find('tr:nth-child(2)');
    const $unitsLostRow = $unitTable.find('tr:nth-child(3)');

    return $unitTypesRow
      .find('[data-unit]')
      .map((_, unitTypeCell) => {
        const unitType = $(unitTypeCell).attr('data-unit');
        const unitsSent = $unitsSentRow.find(`.unit-item-${unitType}`).text().trim();
        const unitsLost = $unitsLostRow.find(`.unit-item-${unitType}`).text().trim();

        return {
          type: unitType,
          sent: unitsSent || '0',
          lost: unitsLost || '0',
        };
      })
      .get()
      .reduce(
        (res, item) => ({
          ...res,
          [item.type]: {
            sent: item.sent,
            lost: item.lost,
          },
        }),
        {},
      );
  }
}
