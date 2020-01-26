const axios = require('axios');
const Player = require('../models/Player');
const User = require('../models/User');

// index, show, store, update, destroy

module.exports = {
  async store(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { uplay_name, username } = req.body;

    let player = await Player.findOne({ origin_name });

    if (player)
      return res
        .status(422)
        .json({ msg: `${origin_name} already registered.` });

    const user = await User.findOne({ username });

    if (!user) return res.status(422).json({ msg: 'User not found.' });

    playerInfo = await axios
      .get(
        `https://r6tab.com/api/search.php?platform=uplay&search=${uplay_name}`
      )
      .catch(error => {
        console.log('error ' + error);
      });

    const playersArray = playerInfo.data.results;

    const { p_id } = playersArray.filter(
      item => item.p_name.toLowerCase() == uplay_name.toLowerCase()
    )[0];

    if (!p_id)
      return res
        .status(422)
        .json({ msg: 'Player not found. Please check your UPlay name.' });

    player = await Player.create({
      r6_id: p_id,
      uplay_name: uplay_name,
      user: user
    });

    return res.json(player);
  },
  async index(req, res) {
    const playersRes = [];
    const playersArray = await Player.find();

    if (!playersArray)
      return res.status(422).json({ msg: 'No players found.' });

    await Promise.all(
      playersArray.map(async player => {
        const { r6_id } = player;

        const playerStats = await axios
          .get(`https://r6tab.com/api/player.php?p_id=${r6_id}`)
          .catch(error => {
            console.log('error ' + error);
          });

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
          NA_mmrchange
        } = playerStats.data.ranked;

        const {
          p_name,
          p_currentmmr,
          p_currentrank,
          p_level
        } = playerStats.data;

        const kd_ratio = (NA_deaths == 0 ? 0 : NA_kills / NA_deaths).toFixed(2);
        const wl_ratio = (NA_losses == 0 ? 0 : NA_wins / NA_losses).toFixed(2);

        playersRes.push({
          p_id: r6_id,
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
          NA_mmrchange: NA_mmrchange
        });
      })
    );

    // Order players by current MMR
    playersRes.sort((a, b) => {
      return b.p_currentmmr - a.p_currentmmr;
    });

    return res.json({ playersRes });
  }
};
