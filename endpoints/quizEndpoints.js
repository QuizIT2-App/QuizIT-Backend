const { returnHTML, shuffleArray } = require("../utils/utils");
const { dbGetQuizes, dbGetSubQuizes, dbGetQuizesByID, dbStartQuiz } = require("../db/quizQueries");
const { dbFragenFromPool, dbAddCurrentQuestion } = require("../db/fragenQueries");
const { log } = require("../utils/logger");
const { getCurrentQuiz } = require("./fragenEndpoints");

async function getQuizes(req, res) {
    dbGetQuizes((error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: results })
    });
}

async function getSubQuizes(req, res) {
    let id = req.params.id;

    dbGetSubQuizes(id, (suberror, subresults) => {
        if (suberror) {
            return returnHTML(res, 500, { error: suberror })
        }
        dbGetQuizesByID(id, (quizerror, quizresults) => {
            if (quizerror) {
                return returnHTML(res, 500, { error: quizerror })
            }
            let jsonformat = {
                id: quizresults.id,
                sub: quizresults.sub,
                title: quizresults.title,
                description: quizresults.description,
                children: subresults
            }
            return returnHTML(res, 200, { data: jsonformat })
        })
    });

}

async function startQuiz(req, res) {
    let quizID = req.params.id;
    let userID = req.user.id;
    let { count, timelimit } = req.body;

    if (!timelimit || timelimit <= 0) {
        timelimit = 60 * 60; //1h
    }

    if (!count || count <= 0) {
        count = 1;
    }

    dbFragenFromPool(quizID, (allQuestionserror, allQuestions) => {
        if (allQuestionserror) {
            return returnHTML(res, 500, { error: allQuestionserror })
        }

        count = count > allQuestions.length ? allQuestions.length : count;

        dbStartQuiz(quizID, userID, timelimit, (startQuizerror, currentQuizID) => {
            if (startQuizerror) {
                return returnHTML(res, 500, { error: startQuizerror })
            }

            let uniqueIDs = [...new Set(allQuestions.map(q => q.id))];

            log(uniqueIDs);

            shuffleArray(uniqueIDs);

            let questions = new Set(uniqueIDs.slice(0, count));


            dbAddCurrentQuestion(currentQuizID, [...questions], (error, results) => {
                if (error) {
                    return returnHTML(res, 500, { error: error })
                }
                req.params.id = 0;
                return getCurrentQuiz(req, res);
            });




        });

    });
}



module.exports = {
    getQuizes,
    getSubQuizes,
    startQuiz
};