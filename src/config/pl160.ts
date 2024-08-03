import { Config } from '../app/constants/config.js';

const config: Config = {
  modules: {
    farmAssistant: true,
  },
  ignoredFarmVillages: [],
  attacks: [],
  villages: [
    {
      id: 2109,
      name: '- 001 -',
      coordinate: '439|500',
      farm: {
        enabled: true,
        templates: [
          {
            light: 4,
          },
        ],
      },
    },
  ],
};

export default config;
