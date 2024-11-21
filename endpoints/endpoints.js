const {users, userID, quizes} = require('../db/queries');

async function getUsers(req, res) {
    let items = await users();
    res.json(items)
}
async function getUser(req, res) {
    let id = req.params.id
    let item = (await userID(id))[0];
    if (!item) return res.status(404).send('User not found');
    res.json(item)
}
async function getQuizes(req, res) {
    let quizes = await quizes();
    res.json(quizes)
}


module.exports = {users: getUsers, user: getUser};