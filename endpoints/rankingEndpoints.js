const {getFriendsRanking, getClassRanking, getDepartmentRanking} = require("../db/rankingQuerries");
const {returnHTML} = require("../utils/utils");

async function getSelfFriendsRanking(req, res) {
    let items = await getFriendsRanking(req.user.id);
    return returnHTML(res, 200, {data:items});
}

async function getSelfClassRanking(req, res) {
    let items = await getClassRanking(req.user.id);
    return returnHTML(res, 200, {data:items});
}

async function getSelfDepartmentRanking(req, res) {
    let items = await getDepartmentRanking(req.user.id);
    return returnHTML(res, 200, {data:items});
}


module.exports = {
    getFriendsRanking: getSelfFriendsRanking,
    getClassRanking: getSelfClassRanking,
    getDepartmentRanking: getSelfDepartmentRanking,
}