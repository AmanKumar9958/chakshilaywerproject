const express = require('express');
const cors = require('cors');


// const userRoutes = require('./routes/userRoutes');


const app = express();

app.use(cors());
app.use(express.json());



app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'my-api', version: '1.0.0' });
});




module.exports = app;
