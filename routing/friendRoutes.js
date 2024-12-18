const router = require('express').Router();
const {authAll, authLA, authAdmin} = require('./validation');
const {getFriends,getPending,getRequested,addFriend,deleteFriend} = require('../endpoints/friendEndpoints');

// Friends DONE
router.get('/self/friends', authAll, getFriends);
router.get('/self/friends/pending', authAll, getPending);
router.get('/self/friends/requested', authAll, getRequested);
router.post('/self/friends', authAll, addFriend);
router.delete('/self/friends', authAll, deleteFriend);


module.exports = router;