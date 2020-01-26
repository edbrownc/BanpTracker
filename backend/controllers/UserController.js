const axios = require('axios');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// index, show, store, update, destroy

module.exports = {
  async store(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, name, email } = req.body;

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
        .status(422)
        .json({ msg: `No user found with username ${username}.` });

    return res.json(user);
  },
  async update(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, name, email } = req.body;
    let user = await User.findOne({ username });

    if (!user)
      return res
        .status(422)
        .json({ msg: `No user found with username ${username}.` });

    user = await User.findOneAndUpdate({ username }, { username, name, email });

    return res.json(user);
  },
  async destroy(req, res) {
    const { username } = req.body;
    let user = await User.findOne({ username });

    if (!user)
      return res
        .status(422)
        .json({ msg: `No user found with username ${username}.` });

    await User.findOneAndDelete({ username });

    return res.json({ msg: `${username} deleted.` });
  }
};
