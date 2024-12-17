const router = require('express').Router();
const {auth, login} = require('./validation');
const {returnHTML} = require("../utils/utils");

const {serve, setup} = require('../endpoints/swagger');

const {getSelf, deleteSelf} = require('../endpoints/userEndpoints');
const {getFriends,getPending,getRequested,addFriend,deleteFriend} = require('../endpoints/friendEndpoints');
const {getFriendsRanking,getClassRanking,getDepartmentRanking} = require("../endpoints/rankingEndpoints");
const {join} = require("node:path");

const authAll = auth(['schueler','lehrer','admin']);
const authLA = auth(['lehrer','admin']);
const authAdmin = auth(['admin']);

router.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../endpoints', 'index.html'));
});
// Swagger
router.use('/api', serve, setup);

// Login
router.post('/login', login);

// Self
router.get('/self', authAll, getSelf);
router.post('/self', authAll, );                //TODO
router.delete('/self', authAll, deleteSelf);

// Friends
router.get('/self/friends', authAll, getFriends);
router.get('/self/friends/pending', authAll, getPending);
router.get('/self/friends/requested', authAll, getRequested);
router.post('/self/friends', authAll, addFriend);
router.delete('/self/friends', authAll, deleteFriend);

// Ranking
router.get('/self/friendsRanking', authAll, getFriendsRanking);
router.get('/self/classRanking', authAll, getClassRanking);
router.get('/self/departmentRanking', authAll, getDepartmentRanking)





module.exports = router;