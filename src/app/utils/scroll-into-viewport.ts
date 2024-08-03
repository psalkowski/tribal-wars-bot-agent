import { Page } from 'puppeteer';

export async function scrollIntoViewport(page: Page, selector: string) {
  await page.evaluate((selector: string) => {
    const element = document.querySelector(selector);

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const offsetTop = 100;
      const offsetBottom = 100;

      if (rect.top > windowHeight - offsetBottom) {
        window.scrollTo(0, scrollY + rect.top - offsetTop);
      }

      if (rect.top < offsetTop) {
        if (rect.top >= 0) {
          window.scrollTo(0, scrollY - offsetTop);
        } else {
          window.scrollTo(0, scrollY + rect.top - offsetTop);
        }
      }
    }
  }, selector);
}
