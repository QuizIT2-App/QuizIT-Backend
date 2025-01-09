const router = require('express').Router();
const {authAll, authLA, authAdmin} = require('./validation');
const {getQuizes, getSubQuizes} = require("../endpoints/quizEndpoints");

router.get('/quiz', authAll, getQuizes);
router.get('/quiz/:id', authAll, getSubQuizes);

module.exports = router;