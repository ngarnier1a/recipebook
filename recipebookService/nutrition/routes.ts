import { updateSessionUser } from "../users/routes.js";
import * as dao from "./dao.js";
import { Application, Request, Response } from "express";
import axios from "axios";

const FDC_API_KEY = process.env.FDC_API_KEY
const FDC_API_URL = "https://api.nal.usda.gov/fdc/v1"
const SEARCH_LIMIT = 15;

export default function NutritionRoutes(app: Application) {

  let throttleCalls = false;

  const searchFDC = async (keyword: string) => {
    if (!FDC_API_KEY) {
      throw new Error("FDC_API_KEY env variable is not set");
    }

    try {
      const [filledLimit, existingFoods] = await dao.getFoodDataByKeyword(keyword, SEARCH_LIMIT);

      if (filledLimit || await dao.checkCallKeyword(keyword) || throttleCalls) {
        return existingFoods;
      }

      const query = `${keyword}&dataType=Branded&pageSize=50`
      const FDCResult = await axios.get(`${FDC_API_URL}/foods/search?query=${query}&api_key=${process.env.FDC_API_KEY}`)

      // ensure no duplicate call made
      dao.addCallKeyword(keyword);

      const rateLimitRemaining = FDCResult.headers['x-ratelimit-remaining'];

      console.log(`${rateLimitRemaining} remaining calls to FDC API`)
      // ensure not reach cap
      if (rateLimitRemaining && parseInt(rateLimitRemaining) < 300) {
        console.error("Rate limit reached, throttling calls to FDC API");
        throttleCalls = true;
        setTimeout(() => {
          throttleCalls = false;
        }, 1000 * 60 * 60);
      }

      const FDCData = FDCResult.data;
      try {
        const addedFoods = await dao.addFDCData(FDCData);
        return [...existingFoods, ...addedFoods].splice(0, SEARCH_LIMIT * 2);
      } catch (e) {
        console.error(`Error saving FDC data: ${e}`);
        return [...existingFoods].splice(0, SEARCH_LIMIT * 2);
      }
    } catch (e) {
      console.error(`Error searching FDC: ${e}`);
      throw e;
    }
  }

  const getFromFDC = async (fdcId: string) => {
    if (!FDC_API_KEY) {
      throw new Error("FDC_API_KEY env variable is not set");
    }
    try {
      const FDCResult = await axios.get(`${FDC_API_URL}/food/${fdcId}?api_key=${process.env.FDC_API_KEY}`)
      return dao.toFDCFoodItem(FDCResult.data);
    } catch (e) {
      console.error(`Error getting FDC data: ${e}`);
      throw e;
    }
  }

  app.get('/api/nutrition/health', (req: Request, res: Response) => res.sendStatus(200));
  app.get('/api/nutrition/search', async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q) {
      res.sendStatus(400);
      return;
    }
    try {
      const results = await searchFDC(q as string);
      res.json(results);
    } catch (e) {
      console.error(`Error searching FDC: ${e}`);
      res.sendStatus(500);
    }
  });
  app.get('/api/nutrition/:fdcId', async (req: Request, res: Response) => {
    const { fdcId } = req.params;
    try {
      const food = await dao.getFoodDataById(fdcId);
      if (food) {
        res.json(food);
      } else {
        const newFoodItem = await getFromFDC(fdcId);
        dao.addFDCFoodItem(newFoodItem);
        res.json(newFoodItem);
      }
    } catch (e) {
      console.error(`Error getting food data: ${e}`);
      res.sendStatus(500);
    }
  });
}
