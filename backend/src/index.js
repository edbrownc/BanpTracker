const express = require('express');
const mongoose = require('mongoose');
const routes = require('../routes');
const cors = require('cors');

const app = express();

// Mongoose
mongoose.connect(
  'mongodb+srv://banptracker:banptracker@cluster0-79oad.mongodb.net/banptracker?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// cors
app.use(cors());

// Exporess
app.use(express.json());
app.use(routes);

app.listen(3333);
