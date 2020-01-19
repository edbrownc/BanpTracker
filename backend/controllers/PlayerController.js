const axios = require('axios');
const Player = require('../models/Player');

module.exports = {
  async store(req, res) {
    const { uplay_name, name, email } = req.body;

    playerInfo = await axios.get(
      `https://r6tab.com/api/search.php?platform=uplay&search=${uplay_name}`
    );

    const playersArray = playerInfo.data.results;

    console.log(playersArray);

    const { p_id } = playersArray.filter(
      item => item.p_name.toLowerCase() == uplay_name.toLowerCase()
    )[0];

    const player = await Player.create({
      p_id: p_id,
      uplay_name: uplay_name,
      name: name,
      email: email
    });

    return res.json(player);
  },
  async index(req, res) {
    const playersRes = [];
    const playersArray = await Player.find();

    if (!playersArray) {
      return res.json({ message: 'No players found.' });
    }

    await Promise.all(
      playersArray.map(async player => {
        const { p_id } = player;

        const playerStats = await axios.get(
          `https://r6tab.com/api/player.php?p_id=${p_id}`
        );

        const {
          NA_kills,
          NA_deaths,
          NA_wins,
          NA_losses,
          NA_abandons,
          NA_mmr,
          NA_maxmmr,
          NA_maxrank,
          NA_champ,
          NA_mmrchange,
          SA_kills,
          SA_deaths,
          SA_wins,
          SA_losses,
          SA_abandons,
          SA_mmr,
          SA_maxmmr,
          SA_maxrank,
          SA_champ,
          SA_mmrchange
        } = playerStats.data.ranked;

        const {
          p_name,
          p_currentmmr,
          p_currentrank,
          p_level
        } = playerStats.data;

        const kd_ratio = (NA_kills / NA_deaths).toFixed(2);
        const wl_ratio = (NA_wins / NA_losses).toFixed(2);

        playersRes.push({
          p_id: p_id,
          p_name: p_name,
          p_currentmmr: p_currentmmr,
          p_currentrank: p_currentrank,
          p_level: p_level,
          kd_ratio: kd_ratio,
          wl_ratio: wl_ratio,
          NA_kills: NA_kills,
          NA_deaths: NA_deaths,
          NA_wins: NA_wins,
          NA_losses: NA_losses,
          NA_abandons: NA_abandons,
          NA_mmr: NA_mmr,
          NA_maxmmr: NA_maxmmr,
          NA_maxrank: NA_maxrank,
          NA_champ: NA_champ,
          NA_mmrchange: NA_mmrchange,
          SA_kills: SA_kills,
          SA_deaths: SA_deaths,
          SA_wins: SA_wins,
          SA_losses: SA_losses,
          SA_abandons: SA_abandons,
          SA_mmr: SA_mmr,
          SA_maxmmr: SA_maxmmr,
          SA_maxrank: SA_maxrank,
          SA_champ: SA_champ,
          SA_mmrchange: SA_mmrchange
        });
      })
    );

    return res.json({ playersRes });
  }
};
