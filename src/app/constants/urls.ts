import { ScreenType } from './screen.js';

export const TribalWarsUrls = {
  open_game: 'https://__world__.plemiona.pl/game.php?screen=overview&intro',
  public_villages: 'https://__world__.plemiona.pl/map/village.txt',
  place: `https://__world__.plemiona.pl/game.php?village=__village__&screen=${ScreenType.PLACE}`,
  overview: `https://pl203.plemiona.pl/game.php?village=__village__&screen=${ScreenType.OVERVIEW}`,
};
