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
    let jsonformat = {
        id: quiz.id,
        sub: quiz.sub,
        title: quiz.title,
        description: quiz.description,
        children: sub
    }

    return returnHTML(res, 200, {data: jsonformat})
}

async function startQuiz(req, res) {
    let id = req.params.id;
    let {count, timelimit } = req.body;
    if(!timelimit || timelimit <= 0) {
        timelimit = 60*60*24; //24h
    }
    if(!count) {
        count = 5;
    }
}



module.exports = {
    getQuizes,
    getSubQuizes,
    startQuiz
};