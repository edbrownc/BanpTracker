const axios = require('axios');
const Player = require('../models/Player');
const User = require('../models/User');

module.exports = {
  async store(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { origin_name, username } = req.body;
    const headers = {
      'TRN-Api-Key': process.env.TRACKER_API_KEY
    };

    const user = await User.findOne({ username });

    if (!user) return res.status(422).json({ msg: 'User not found.' });

    let player = await Player.findOne({ origin_name });

    if (player)
      return res
        .status(422)
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
        .status(422)
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
      return res.status(422).json({ msg: 'No players found.' });

    await Promise.all(
      playersArray.map(async player => {
        const { apex_id, origin_name } = player;

        playerInfo = await axios.get(
          `https://public-api.tracker.gg/apex/v2/standard/profile/5/${origin_name}`,
          { headers }
        );

        const { icon } = playerInfo.data.children.metadata;
        const { stats } = playerInfo.data.stats;

        playersRes.push({
          apex_id,
          origin_name,
          icon,
          stats
        });
      })
    );

    return res.json({ playersRes });
  }
};
