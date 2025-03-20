const {returnHTML, shuffleArray} = require("../utils/utils");
const {dbGetQuizes, dbGetSubQuizes, dbGetQuizesByID, dbStartQuiz} = require("../db/quizQueries");
const {dbFragenFromPool, dbAddCurrentQuestion} = require("../db/fragenQueries");
const {log} = require("../utils/logger");

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
    let quizID = req.params.id;
    let userID = req.user.id;
    let {count, timelimit } = req.body;

    if(!timelimit || timelimit <= 0) {
        timelimit = 60*60; //1h
    }

    if(!count || count <= 0) {
        count = 1;
    }

    let allQuestions = await dbFragenFromPool(quizID);

    count = count > allQuestions.length ? allQuestions.length : count;

    let currentQuizID = await dbStartQuiz(quizID, userID, timelimit);

    let uniqueIDs = [...new Set(allQuestions.map(q => q.id))];

    log(uniqueIDs);

    shuffleArray(uniqueIDs);

    let questions = new Set(uniqueIDs.slice(0, count));

    questions.forEach(questionID => {
        dbAddCurrentQuestion(currentQuizID, questionID)
    })


    //TODO weiterleitung
    return returnHTML(res, 200, {data: {}})
}



module.exports = {
    getQuizes,
    getSubQuizes,
    startQuiz
};