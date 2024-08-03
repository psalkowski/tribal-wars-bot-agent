import { Service } from 'typedi';

@Service()
class TribalData {
  data: TribalGameData;

  setGameData(data: TribalGameData) {
    this.data = data;
  }

  getGameData(): TribalGameData {
    return this.data;
  }
}

export interface TribalGameData {
  features: {
    Premium: { possible: boolean; active: boolean };
    AccountManager: { possible: boolean; active: boolean };
    FarmAssistant: { possible: boolean; active: boolean };
  };
  player: {
    villages: string;
  };
  csrf: string;
  version: string;
}

const TribalDataInstance = new TribalData();

export { TribalDataInstance };
