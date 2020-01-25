const axios = require('axios');
const Player = require('../models/Player');
const User = require('../models/User');

module.exports = {
  async store(req, res) {
    const { origin_name, username } = req.body;
    const headers = {
      'TRN-Api-Key': process.env.TRACKER_API_KEY
    };

    if (!origin_name)
      return res.status(404).json({ msg: 'Please provide your origin name.' });

    if (!username)
      return res.status(404).json({ msg: 'Please provide your username.' });

    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ msg: 'User not found.' });

    let player = await Player.findOne({ origin_name });

    if (player)
      return res
        .status(404)
        .json({ msg: `${origin_name} already registered.` });

    const playerInfoRes = await axios
      .get(
        `https://public-api.tracker.gg/apex/v1/standard/profile/5/${origin_name}`,
        { headers }
      )
      .catch(error => {
        console.log('error ' + error);
      });

    if (!playerInfoRes)
      return res
        .status(404)
        .json({ msg: `${origin_name} not found in Apex Legends.` });

    const { id } = playerInfoRes.data.data;

    player = await Player.create({
      apex_id: id,
      origin_name: origin_name,
      user: user
    });

    return res.json(player);
  },
  async index(req, res) {
    const playersRes = [];

    const playersArray = await Player.find();

    if (!playersArray)
      return res.status(404).json({ msg: 'No players found.' });

    await Promise.all(
      playersArray.map(async player => {
        const { apex_id, origin_name } = player;

        playerInfo = await axios.get(
          `https://public-api.tracker.gg/apex/v2/standard/profile/5/${origin_name}`,
          { headers }
        );

        console.log(playerInfo);

        // const kd_ratio = (NA_deaths == 0 ? 0 : NA_kills / NA_deaths).toFixed(2);
        // const wl_ratio = (NA_losses == 0 ? 0 : NA_wins / NA_losses).toFixed(2);

        // playersRes.push({
        //   apex_id: apex_id,
        //   p_name: p_name,
        //   p_currentmmr: p_currentmmr,
        //   p_currentrank: p_currentrank,
        //   p_level: p_level,
        //   kd_ratio: kd_ratio,
        //   wl_ratio: wl_ratio,
        //   NA_kills: NA_kills,
        //   NA_deaths: NA_deaths,
        //   NA_wins: NA_wins,
        //   NA_losses: NA_losses,
        //   NA_abandons: NA_abandons,
        //   NA_mmr: NA_mmr,
        //   NA_maxmmr: NA_maxmmr,
        //   NA_maxrank: NA_maxrank,
        //   NA_champ: NA_champ,
        //   NA_mmrchange: NA_mmrchange
        // });
      })
    );

    // Order players by current MMR
    playersRes.sort((a, b) => {
      return b.p_currentmmr - a.p_currentmmr;
    });

    return res.json({ playersRes });
  }
};
