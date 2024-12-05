const router = require('express').Router();
const {auth, login} = require('./validation');
const {serve, setup} = require('../endpoints/swagger');
const {getSelf, deleteSelf} = require('../endpoints/userEndpoints');
const {getFriends,getPending} = require('../endpoints/friendEndpoints');

const authAll = auth(['schueler','lehrer','admin']);
const authLA = auth(['lehrer','admin']);
const authAdmin = auth(['admin']);

// Swagger
//router.use('/api', serve, setup);

// Login
router.post('/login', login);

// Self
router.get('/self', authAll, getSelf);
router.post('/self', authAll, );                //TODO
router.delete('/self', authAll, deleteSelf);

// Friends
router.get('/self/friends', authAll, getFriends);
router.get('/self/friends/pending', authAll, getPending);
router.post('/self/friends', authAll, );        //TODO
router.delete('/self/friends', authAll, );      //TODO





module.exports = router;