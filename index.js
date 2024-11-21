dotenv = require('dotenv').config();
const env = process.env;
const express = require('express');

const router = require('./routing/router');


const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());
app.use(router);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

