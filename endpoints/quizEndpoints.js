const {returnHTML} = require("../utils/utils");
const {dbGetQuizes, dbGetSubQuizes, dbGetQuizesByID} = require("../db/quizQueries");

async function getQuizes(req, res) {
    let items = await dbGetQuizes();
    return returnHTML(res, 200, {data: items})
}

async function getSubQuizes(req, res) {
    let id = req.params.id;
    let sub = await dbGetSubQuizes(id);
    let quiz = await dbGetQuizesByID(id);

    return returnHTML(res, 200, {data: quiz + "children:"+ sub})
}



module.exports = {
    getQuizes,
    getSubQuizes
};