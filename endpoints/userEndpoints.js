const { returnHTML } = require("../utils/utils");
const { getUserByID, deleteUser, changeUserName } = require('../db/userQueries');

async function getSelf(req, res) {
    getUserByID(req.user.id, (error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        if (!results)
            return returnHTML(res, 404, { error: "User not found" })
        return returnHTML(res, 200, { data: results })
    });

}

async function putSelf(req, res) {
    let { name } = req.body;
    changeUserName(req.user.id, name, (err, results) => {
        if (err) {
            return returnHTML(res, 500, { error: err })
        }
        return returnHTML(res, 200, { data: name })
    })
}

async function deleteSelf(req, res) {
    deleteUser(req.user.id);
    return returnHTML(res, 200, { data: { text: "User Deleted" } });
}



module.exports = {
    getSelf,
    putSelf,
    deleteSelf,
};