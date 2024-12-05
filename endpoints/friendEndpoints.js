const {returnHTML} = require("../utils/utils");
const {getFriends, getPending} = require("../db/friendQueries");

async function getSelfFriends(req, res) {
    let items = await getFriends(req.token.id);
    return returnHTML(res,200,{data: items});
}

async function getSelfPending(req, res) {
    let items = await getPending(req.token.id);
    return returnHTML(res,200,{data: items});

}

async function addSelfFriend(req, res) {
    body=req.body;
}

async function deleteSelfFriend(req, res) {}

module.exports = {
    getFriends: getSelfFriends,
    getPending: getSelfPending,
    addFriend: addSelfFriend,
    deleteFriend: deleteSelfFriend,
}
