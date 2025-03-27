const {getFriendsRanking, getClassRanking, getDepartmentRanking} = require("../db/rankingQuerries");
const {returnHTML} = require("../utils/utils");

async function getSelfFriendsRanking(req, res) {
    getFriendsRanking(req.user.id, (error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: results });
    });
}

async function getSelfClassRanking(req, res) {
    getClassRanking(req.user.id, (error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: results });
    });
}

async function getSelfDepartmentRanking(req, res) {
    getDepartmentRanking(req.user.id, (error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: results });
    });
}


module.exports = {
    getFriendsRanking: getSelfFriendsRanking,
    getClassRanking: getSelfClassRanking,
    getDepartmentRanking: getSelfDepartmentRanking,
}