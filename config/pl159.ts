import {Config, FarmTemplates} from "../src/constants/config";

const config: Config = {
    modules: {
        farmAssistant: false,
    },
    ignoredFarmVillages: [
    ],
    attacks: [

    ],
    villages: [
        {
            id: 6188,
            name: '- 001 -',
            coordinate: '558|450',
            farm: {
                enabled: true,
                templates: [
                    {
                        light: 1,
                    }
                ]
            },
        },
    ]
}

export default config;
