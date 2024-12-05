const {returnHTML} = require("../utils/utils");
const {getUserByID, deleteUser} = require('../db/userQueries');

async function getSelf(req, res) {
    let item = await getUserByID(req.token.id);
    return returnHTML(res,200,{data: item})
}

async function updateSelf(req, res) {
    //TODO
}

async function deleteSelf(req, res) {
    deleteUser(req.token.id);
    return returnHTML(res,200,{data: {text: "User Deleted"}});
}



module.exports = {
    getSelf,
    updateSelf,
    deleteSelf,
};