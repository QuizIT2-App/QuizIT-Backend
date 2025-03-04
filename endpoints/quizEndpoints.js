const {returnHTML} = require("../utils/utils");
const {dbGetQuizes, dbGetSubQuizes, dbGetQuizesByID, dbStartQuiz} = require("../db/quizQueries");
const {dbFragenFromPool, dbAddCurrentQuestion} = require("../db/fragenQueries");

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

    let questions = new Set();

    while (questions.size < count) {
        let questionID = allQuestions[Math.floor(Math.random() * allQuestions.length)].id;
        questions.add(questionID);
    }

    questions.forEach(questionID => {
        dbAddCurrentQuestion(currentQuizID, questionID)
    })

    return returnHTML(res, 200, {data:"idk"})
    // TODO austauschen durch weiterleitung an erste frage rückgabe
}



module.exports = {
    getQuizes,
    getSubQuizes,
    startQuiz
};