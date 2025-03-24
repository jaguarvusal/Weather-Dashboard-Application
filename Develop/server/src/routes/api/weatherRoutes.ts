import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  // TODO: GET weather data from city name
  WeatherService.getWeatherForCity(req.body.cityName)
    .then((weatherData) => {
      res.json(weatherData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

  // TODO: save city to search history
  HistoryService.addCity(req.body.cityName);
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const savedStates = await HistoryService.getCities();
    res.json(savedStates);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ msg: 'City id is required' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'City successfully removed from search history' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
