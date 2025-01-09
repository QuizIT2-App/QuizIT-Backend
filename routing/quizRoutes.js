const router = require('express').Router();
const {authAll, authLA, authAdmin} = require('./validation');
const {getQuizes, getSubQuizes, startQuiz} = require("../endpoints/quizEndpoints");

router.get('/quiz', authAll, getQuizes);
router.get('/quiz/:id', authAll, getSubQuizes);
router.post('/startquiz/:id', authAll, startQuiz);

module.exports = router;