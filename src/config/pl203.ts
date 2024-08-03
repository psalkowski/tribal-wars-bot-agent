import { Config } from '../app/constants/config.js';

const config: Config = {
  modules: { farmAssistant: false },
  ignoredFarmVillages: [],
  attacks: [],
  villages: [
    {
      id: 33905,
      name: '- 001 -',
      coordinate: '577|661',
      farm: {
        enabled: false,
        templates: [
          {
            light: 1,
          },
        ],
      },
    },
  ],
};

export default config;
