import { Coordinate } from '../src/models/coordinate';
import Config from '../src/config/pl156';

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getDistance = (source: Coordinate, target: Coordinate) => {
  return source.distanceTo(target);
};

const getVillageId = (coords: string): number => {
  const village = Config.villages.find(
    (village) => village.coordinate === coords,
  );

  return village.id;
};

const pairs = [
  {
    source: '385|481',
    target: ['385|480', '384|478', '382|482'],
    army: {
      spear: 100,
      sword: 100,
      snob: 1,
    },
  },
  {
    source: '372|484',
    target: ['373|483', '373|480'],
    army: {
      spear: 100,
      sword: 100,
      snob: 1,
    },
  },
  {
    source: '376|476',
    target: ['377|476', '374|477'],
    army: {
      spear: 100,
      sword: 100,
      snob: 1,
    },
  },
  {
    source: '388|462',
    target: ['385|462'],
    army: {
      axe: 100,
      snob: 1,
    },
  },
  {
    source: '389|463',
    target: ['389|465', '389|461'],
    army: {
      spear: 100,
      sword: 100,
      snob: 1,
    },
  },
  {
    source: '381|473',
    target: ['381|475', '380|475', '380|476'],
    army: {
      axe: 100,
      snob: 1,
    },
  },
  {
    source: '379|467',
    target: ['380|469', '379|469'],
    army: {
      spear: 100,
      sword: 100,
      snob: 1,
    },
  },
  {
    source: '386|463',
    target: ['383|461'],
    army: {
      axe: 100,
      snob: 1,
    },
  },
  {
    source: '376|485',
    target: ['378|483', '381|485', '381|481'],
    army: {
      spear: 100,
      sword: 100,
      snob: 1,
    },
  },
];

(async () => {
  console.log(pairs.map((pair) => pair.target).reduce((a, b) => [...a, ...b]));

  // const getAttacks = (config) => {
  //     const source = Coordinate.from(config.source);
  //     const coordinates = config.target.map(Coordinate.from);
  //     const army = new Army(config.army);
  //
  //     const attacks = [];
  //
  //     coordinates.forEach(coordinate => {
  //         const now = moment().add(2, 'minutes');
  //         const distance = getDistance(source, coordinate);
  //         const duration = army.getAttackDuration();
  //         const length = Math.round(distance * duration / 1000) * 1000;
  //
  //         for (let i = 0; i < 7; i++) {
  //             const command: AttackConfig = {
  //                 target: coordinate.toString(),
  //                 type: AttackType.ATTACK,
  //                 village: getVillageId(source.toString()),
  //                 army: config.army,
  //                 runAt: (i === 0 ? now.add(random(5, 300), 'seconds') : now
  //                     .add(length)
  //                     .add(random(180, 300), 'seconds')
  //                     .add(random(0, 999)))
  //                     .format('DD.MM.YYYY HH:mm:ss.SSS')
  //             };
  //
  //             attacks.push(command);
  //         }
  //     });
  //
  //     return attacks;
  // }
  //
  // fs.writeFileSync('attacks.json', JSON.stringify(pairs.map(getAttacks).reduce((a, b) => [...a, ...b]), null, 4));
})();
