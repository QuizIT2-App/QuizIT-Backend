const router = require('express').Router();
const {authAdmin} = require('./validation');
const {update} = require('../endpoints/adminEndpoints');

router.get('/admin/update', authAdmin, update)

module.exports = router;