import {Config, FarmTemplates} from "../src/constants/config";

const config: Config = {
    modules: {
        farmAssistant: true,
    },
    ignoredFarmVillages: [
    ],
    attacks: [

    ],
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
                    }
                ]
            },
        },
    ]
}

export default config;
