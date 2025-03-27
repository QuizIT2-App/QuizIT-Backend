const { returnHTML } = require("../utils/utils");
const { getFriends, getPending, getRequested, deleteFriend, addFriend } = require("../db/friendQueries");

async function getSelfFriends(req, res) {
    getFriends(req.user.id, (error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: results });
    });
}

async function getSelfPending(req, res) {
    getPending(req.user.id, (error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: results });
    });
}

async function getSelfRequested(req, res) {
    getRequested(req.user.id, (error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: results });
    });
}

async function addSelfFriend(req, res) {
    let { id } = req.body;
    if (!id)
        returnHTML(res, 400, { error: "BadRequestError" })
    addFriend(req.user.id, id);
    return returnHTML(res, 200, { data: "friend request successful" });
}

async function deleteSelfFriend(req, res) {
    let { id } = req.body;
    if (!id)
        returnHTML(res, 400, { error: "BadRequestError" })
    deleteFriend(req.user.id, id);
    return returnHTML(res, 200, { data: "removed friend" });
}

module.exports = {
    getFriends: getSelfFriends,
    getPending: getSelfPending,
    getRequested: getSelfRequested,
    addFriend: addSelfFriend,
    deleteFriend: deleteSelfFriend,
}
