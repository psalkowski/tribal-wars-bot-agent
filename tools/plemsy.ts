const moment = require('moment');
const fs = require('fs');
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const recipe = `Rozpiska ataków została stworzona przez Niezbędnik do plemion - https://plemsy.pl/planer-atakow?swiat=pl156

1. Wyślij atak (Taran) z wioski 372|484 na wioskę 421|463 dnia 20.11.2020 o 09:20:41
[url=https://pl156.plemiona.pl/game.php?village=17865&screen=place&target=8011]Wykonaj[/url]

2. Wyślij atak (Taran) z wioski 376|485 na wioskę 421|463 dnia 20.11.2020 o 10:57:18
[url=https://pl156.plemiona.pl/game.php?village=16400&screen=place&target=8011]Wykonaj[/url]

3. Wyślij atak (Taran) z wioski 376|476 na wioskę 421|463 dnia 20.11.2020 o 12:34:48
[url=https://pl156.plemiona.pl/game.php?village=17352&screen=place&target=8011]Wykonaj[/url]

4. Wyślij atak (Taran) z wioski 377|474 na wioskę 420|463 dnia 20.11.2020 o 13:48:28
[url=https://pl156.plemiona.pl/game.php?village=16837&screen=place&target=8369]Wykonaj[/url]

5. Wyślij atak (Taran) z wioski 383|485 na wioskę 420|463 dnia 20.11.2020 o 14:28:36
[url=https://pl156.plemiona.pl/game.php?village=14658&screen=place&target=8369]Wykonaj[/url]

6. Wyślij atak (Taran) z wioski 388|490 na wioskę 420|463 dnia 20.11.2020 o 15:03:56
[url=https://pl156.plemiona.pl/game.php?village=14071&screen=place&target=8369]Wykonaj[/url]

7. Wyślij atak (Taran) z wioski 394|494 na wioskę 418|463 dnia 20.11.2020 o 16:23:52
[url=https://pl156.plemiona.pl/game.php?village=12355&screen=place&target=8042]Wykonaj[/url]

8. Wyślij atak (Taran) z wioski 394|492 na wioskę 418|463 dnia 20.11.2020 o 17:10:42
[url=https://pl156.plemiona.pl/game.php?village=11806&screen=place&target=8042]Wykonaj[/url]

9. Wyślij atak (Taran) z wioski 399|495 na wioskę 418|463 dnia 20.11.2020 o 17:23:32
[url=https://pl156.plemiona.pl/game.php?village=12251&screen=place&target=8042]Wykonaj[/url]

10. Wyślij atak (Taran) z wioski 391|485 na wioskę 418|464 dnia 20.11.2020 o 18:53:51
[url=https://pl156.plemiona.pl/game.php?village=13596&screen=place&target=8068]Wykonaj[/url]

11. Wyślij atak (Taran) z wioski 397|491 na wioskę 418|464 dnia 20.11.2020 o 18:53:51
[url=https://pl156.plemiona.pl/game.php?village=12542&screen=place&target=8068]Wykonaj[/url]

12. Wyślij atak (Taran) z wioski 390|482 na wioskę 418|464 dnia 20.11.2020 o 19:21:24
[url=https://pl156.plemiona.pl/game.php?village=13188&screen=place&target=8068]Wykonaj[/url]

13. Wyślij atak (Taran) z wioski 399|490 na wioskę 417|464 dnia 20.11.2020 o 20:11:19
[url=https://pl156.plemiona.pl/game.php?village=11079&screen=place&target=7793]Wykonaj[/url]

14. Wyślij atak (Taran) z wioski 397|488 na wioskę 417|464 dnia 20.11.2020 o 20:22:46
[url=https://pl156.plemiona.pl/game.php?village=11081&screen=place&target=7793]Wykonaj[/url]

15. Wyślij atak (Taran) z wioski 393|483 na wioskę 417|464 dnia 20.11.2020 o 20:41:41
[url=https://pl156.plemiona.pl/game.php?village=13479&screen=place&target=7793]Wykonaj[/url]

16. Wyślij atak (Taran) z wioski 396|485 na wioskę 416|465 dnia 20.11.2020 o 21:51:28
[url=https://pl156.plemiona.pl/game.php?village=12197&screen=place&target=19788]Wykonaj[/url]

17. Wyślij atak (Taran) z wioski 399|487 na wioskę 416|465 dnia 20.11.2020 o 22:05:55
[url=https://pl156.plemiona.pl/game.php?village=11346&screen=place&target=19788]Wykonaj[/url]

18. Wyślij atak (Taran) z wioski 398|482 na wioskę 416|465 dnia 20.11.2020 o 23:37:14
[url=https://pl156.plemiona.pl/game.php?village=11743&screen=place&target=19788]Wykonaj[/url]
`;

(async () => {
  const lines: string[] = [];

  recipe.split('\n').forEach((line) => {
    if (!line) {
      lines.push('');
    }

    if (!lines.length) {
      return;
    }

    lines[lines.length - 1] += line + ' ';
  });

  const attacks = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const dateTimeMatch = line.match(/([0-9.]+) o ([0-9:]+)/g);
      const urlMatch = line.match(/\[url=(.+?)](.+?)\[\/url\]/i);
      const targetMatch = line.match(/ ([0-9|]+) /g);

      if (!dateTimeMatch || urlMatch.length < 2 || targetMatch?.length < 2) {
        return null;
      }

      const url = new URL(urlMatch[1]);
      const offset = random(0, 60);
      const runAt = moment(
        dateTimeMatch[0].replace(' o ', ' '),
        'DD.MM.YYYY HH:mm:ss',
      );
      const target = targetMatch[1].trim();

      return {
        runAt: runAt
          .subtract(offset, 'minutes')
          .set('millisecond', random(0, 999))
          .format('DD.MM.YYYY HH:mm:ss.SSS'),
        village: Number(url.searchParams.get('village')),
        target: target,
        catapultTarget: 'farm',
        army: {
          spy: 10,
          axe: -1,
          catapult: -1,
        },
      };
    })
    .filter(Boolean);

  fs.writeFileSync('attacks.json', JSON.stringify(attacks, null, 4));
})();
