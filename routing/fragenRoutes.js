const router = require('express').Router();
const {authAll, authLA, authAdmin} = require('./validation');
const {getQuizes} = require("../endpoints/fragenEndpoints");

router.get('/question/:id', authLA, getQuizes);

module.exports = router;