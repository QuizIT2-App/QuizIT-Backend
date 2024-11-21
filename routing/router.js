const router = require('express').Router();
const {auth, login} = require('./validation');
const {serve, setup} = require('../endpoints/swagger');
const {users, user} = require('../endpoints/endpoints');

const authAll = auth(['schueler','lehrer','admin']);
const authLA = auth(['lehrer','admin']);
const authAdmin = auth(['admin']);

//use
router.use('/api', serve, setup);

//POST
router.post('/login', login);

//GET
router.get('/users', authAll, users);
router.get('/users/:id', authAll, user);
router.get('/quizes', authAll, );               //TODO
router.get('/quizes/:id', authAll, );           //TODO
router.get('/fragen/:quizid', authAll, );       //TODO
router.get('/tags/:quizid', authAll, );         //TODO
router.get('/bewertungen/:quizid', authAll, );  //TODO






module.exports = router;