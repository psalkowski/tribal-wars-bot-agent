export interface IGame {
  nav: {
    parent: number;
  };
  link_base: string;
  link_base_pure: string;
  csrf: string;
  world: string;
  market: string;
  RTL: boolean;
  version: string;
  majorVersion: string;
  screen: string;
  mode: unknown;
  device: string;
  pregame: boolean;
  units: string[];
  locale: string;
  group_id: number;
  time_generated: number;
  quest: {
    use_questlines: true;
  };
  features: {
    Premium: IFeature;
    AccountManager: IFeature;
    FarmAssistent: IFeature;
  };
}

export interface IFeature {
  possible: boolean;
  active: boolean;
}
