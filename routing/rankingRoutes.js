const router = require('express').Router();
const {authAll, authLA, authAdmin} = require('./validation');
const {getFriendsRanking,getClassRanking,getDepartmentRanking} = require("../endpoints/rankingEndpoints");

// Ranking DONE
router.get('/self/friendsRanking', authAll, getFriendsRanking);
router.get('/self/classRanking', authAll, getClassRanking);
router.get('/self/departmentRanking', authAll, getDepartmentRanking)


module.exports = router;