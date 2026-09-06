import { chromium } from "playwright";
import normalizePrograms from "./utils.js";
import scrapeTargets from "../constant.js";

export default async function scrapeCourseData() {
  const browser = await chromium.launch({
    headless: false,
  });

  try {
    const page = await browser.newPage();
    const results = [];

    for (const target of scrapeTargets) {
      try {
        await page.goto(target.link, { waitUntil: "networkidle" });
        await page.waitForSelector(target.selector, { timeout: 10000 });

        const courses = await page.$$eval(target.selector, (cards) => {
          return cards.map((card) => {
            const imageAnchor = card.querySelector(".courses-image a");
            const categoryAnchor = card.querySelector(
              ".courses-content a.category"
            );
            const titleElement = card.querySelector(
              ".courses-content .courses-title"
            );

            return {
              category: categoryAnchor
                ? categoryAnchor.innerText.trim()
                : null,
              title: titleElement ? titleElement.innerText.trim() : null,
              link: imageAnchor ? imageAnchor.getAttribute("href") : null,
            };
          });
        });

        results.push({
          Univesity: target.name,
          name: target.name,
          count: courses.length,
          data: normalizePrograms(courses),
        });
      } catch (error) {
        results.push({
          name: target.name,
          count: 0,
          data: [],
          error: error.message,
        });
      }
    }

    return {
      success: results.every((result) => !result.error),
      count: results.reduce((total, result) => total + result.count, 0),
      data: results,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}