const axios = require('axios');
const User = require('../models/User');

// index, show, store, update, destroy

module.exports = {
  async store(req, res) {
    const { username, name, email } = req.body;

    if (!name) return res.status(404).json({ msg: 'Please provide a name.' });

    if (!email)
      return res.status(404).json({ msg: 'Please provide an email.' });

    if (!username)
      return res.status(404).json({ msg: 'Please provide an username.' });

    const user = await User.create({
      name: name,
      email: email,
      username: username
    });

    return res.json(user);
  },
  async index(req, res) {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res
        .status(404)
        .json({ msg: `No user found with username ${username}.` });

    return res.json(user);
  },
  async update(req, res) {
    const { username, name, email } = req.body;
    let user = await User.findOne({ username });

    if (!user)
      return res
        .status(404)
        .json({ msg: `No user found with username ${username}.` });

    user = await User.findOneAndUpdate({ username }, user);

    return res.json(user);
  },
  async destroy(req, res) {
    const { username } = req.body;
    let user = await User.findOne({ username });

    if (!user)
      return res
        .status(404)
        .json({ msg: `No user found with username ${username}.` });

    await User.findOneAndDelete({ username });

    return res.json({ msg: `${username} deleted.` });
  }
};
