dotenv = require('dotenv').config();
const env = process.env;
const express = require('express');
const {maintenance} = require('./utils/updateRoutine');

const generalRouter = require('./routing/generalRoutes');
const userRouter = require('./routing/userRoutes');
const friendRouter = require('./routing/friendRoutes');
const rankingRouter = require('./routing/rankingRoutes');
const quizRouter = require('./routing/quizRoutes');
const adminRouter = require('./routing/adminRoutes');
const {errorLog} = require("./utils/logger");

const app = express();
const PORT = env.PORT || 3000;

process.on('uncaughtException', (err) => {
  errorLog('Uncaught Exception: ' + err.message, { stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  errorLog('Unhandled Rejection: ' + reason, { promise: promise });
  process.exit(1);
});

app.use(express.json());
app.use(maintenance);
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
app.use(quizRouter);
app.use(adminRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

