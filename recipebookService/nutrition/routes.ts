import { updateSessionUser } from "../users/routes.js";
import * as dao from "./dao.js";
import { Application, Request, Response } from "express";
import axios from "axios";

const FDC_API_KEY = process.env.FDC_API_KEY
const FDC_API_URL = "https://api.nal.usda.gov/fdc/v1"

export default function NutritionRoutes(app: Application) {

  let throttleCalls = false;

  const searchFDC = async (keyword: string) => {
    if (!FDC_API_KEY) {
      throw new Error("FDC_API_KEY env variable is not set");
    }

    if (throttleCalls) {
      throw new Error("Too many calls to FDC API");
    }

    try {
      const query = `${keyword}&dataType=Branded&pageSize=25`
      const FDCResult = await axios.get(`${FDC_API_URL}/foods/search?query=${query}&api_key=${process.env.FDC_API_KEY}`)
      const rateLimitRemaining = FDCResult.headers['x-ratelimit-remaining'];

      console.log(FDCResult.headers);

      console.log(`${rateLimitRemaining} remaining calls.`)
      // ensure not reach cap
      if (rateLimitRemaining && parseInt(rateLimitRemaining) < 300) {
        console.error("Rate limit reached, throttling calls to FDC API");
        throttleCalls = true;
        setTimeout(() => {
          throttleCalls = false;
        }, 1000 * 60 * 60);
      }

      const FDCData = await FDCResult.data;
      //console.log(FDCData);

    } catch (e) {
      console.error(`Error searching FDC: ${e}`);
      throw e;
    }
  }

  app.get('/api/nutrition/health', (req: Request, res: Response) => res.sendStatus(200));
  app.get('/api/nutrition/search', async (req: Request, res: Response) => {
    const { query } = req.query;
    if (!query) {
      res.sendStatus(400);
      return;
    }
    console.log(`Searching FDC for ${query}`);
    try {
      const results = await searchFDC(query as string);
      console.log(`Results: ${JSON.stringify(results)}`);
      res.send(results);
    } catch (e) {
      console.error(`Error searching FDC: ${e}`);
      res.sendStatus(500);
    }
  });
}
