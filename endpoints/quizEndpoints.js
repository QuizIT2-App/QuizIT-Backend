const {returnHTML} = require("../utils/utils");
const {dbGetQuizes, dbGetSubQuizes} = require("../db/quizQueries");

async function getQuizes(req, res) {
    let items = await dbGetQuizes();
    return returnHTML(res, 200, {data: items})
}

async function getSubQuizes(req, res) {
    let id = req.params.id;
    let items = await dbGetSubQuizes(id);
    return returnHTML(res, 200, {data: items})
}



module.exports = {
    getQuizes,
    getSubQuizes
};