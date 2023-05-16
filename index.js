/* ---------- DotEnv ---------- */
const dotenv = require('dotenv');
dotenv.config();

/* ---------- Express ---------- */
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./app/router');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middlewares ---------- */
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // response to preflight request
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

app.use(router);
/* ---------- App ---------- */

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} 🚀`);
});