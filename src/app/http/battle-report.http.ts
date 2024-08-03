import { Service } from 'typedi';
import { Api } from '../core/api.js';
import { IApiBattleReport, IBattleReport } from '../models/battle-report.js';

@Service()
export class BattleReportHttp {
  constructor(public api: Api) {}

  fetch(): Promise<IBattleReport[]> {
    return this.api.get<IApiBattleReport[]>('/battle-report').then((reports) => {
      return reports.map(this.apiToAgent);
    });
  }

  create(data: IBattleReport): Promise<IBattleReport> {
    return this.api.post<IApiBattleReport>('/battle-report', this.agentToApi(data)).then(this.apiToAgent);
  }

  private agentToApi(item: IBattleReport): IApiBattleReport {
    return {
      id: item.id,
      status: item.status,
      luck: item.luck,

      attackerVillageId: item.origin.villageId,
      attackerPlayerId: item.origin.playerId,
      attackerX: item.origin.x,
      attackerY: item.origin.y,

      defenderVillageId: item.destination.villageId,
      defenderPlayerId: item.destination.playerId,
      defenderX: item.destination.x,
      defenderY: item.destination.y,

      attackerArmy: item.attackerArmy,
      defenderArmy: item.defenderArmy,
      lootedWood: item.loot.wood,
      lootedStone: item.loot.stone,
      lootedIron: item.loot.iron,
      lootedTotal: item.loot.total,
      lootCapacity: item.loot.capacity,

      battleAt: item.battleAt,
    };
  }

  private apiToAgent(item: IApiBattleReport): IBattleReport {
    return {
      id: item.id,
      status: item.status,
      luck: item.luck,
      origin: {
        villageId: item.attackerVillageId,
        playerId: item.attackerPlayerId,
        x: item.attackerX,
        y: item.attackerY,
      },
      destination: {
        villageId: item.defenderVillageId,
        playerId: item.defenderPlayerId,
        x: item.defenderX,
        y: item.defenderY,
      },
      attackerArmy: item.attackerArmy,
      defenderArmy: item.defenderArmy,
      loot: {
        wood: item.lootedWood,
        stone: item.lootedStone,
        iron: item.lootedIron,
        total: item.lootedTotal,
        capacity: item.lootCapacity,
      },
      battleAt: item.battleAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
