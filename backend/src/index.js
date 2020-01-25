const express = require('express');
const mongoose = require('mongoose');
const routes = require('../routes');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: './config.env' });

const app = express();

const port = process.env.PORT || 3333;

// Mongoose
mongoose.connect(
  'mongodb+srv://banptracker:banptracker@cluster0-79oad.mongodb.net/banptracker?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// Cors
app.use(cors());

// Express
app.use(express.json());
app.use(routes);

app.listen(port);
