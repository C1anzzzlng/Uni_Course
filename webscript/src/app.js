import express from "express";
import scrapeCourseData from "./scraper/course.scrape.js";

const app = express();

app.use(express.json());

app.get("/test", async (req, res) => {
   
 const result = await scrapeCourseData();
  res.json(result);
});


export default app;