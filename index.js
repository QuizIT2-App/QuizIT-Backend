dotenv = require('dotenv').config();
const env = process.env;
const express = require('express');

const generalRouter = require('./routing/generalRoutes');
const userRouter = require('./routing/userRoutes');
const friendRouter = require('./routing/friendRoutes');
const rankingRouter = require('./routing/rankingRoutes');


const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  next();
});
app.use(generalRouter);
app.use(userRouter);
app.use(friendRouter);
app.use(rankingRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

