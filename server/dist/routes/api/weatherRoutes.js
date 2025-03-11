import { Router } from 'express';
import WeatherService from '../../service/weatherService.js';
// import { HistoryService } from '../../service/historyService.js';
const router = Router();
// DONE: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    const cityName = req.body.cityName;
    const weatherResults = await WeatherService.getWeatherForCity(cityName);
    res.json(weatherResults);
    // TODO: save city to search history
});
// // TODO: GET search history
// router.get('/history', async (req, res) => {});
// // * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {});
export default router;
