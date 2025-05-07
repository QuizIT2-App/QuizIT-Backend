const { returnHTML, shuffleArray } = require("../utils/utils");
const { dbGetQuizzes, dbGetSubQuizzes, dbGetQuizzesByID, dbStartQuiz, dbGetAllQuizzes, dbAddQuiz, closeOpenQuizzes, dbDeleteQuiz, dbGetAllQuizzesSub} = require("../db/quizQueries");
const { dbFragenFromPool, dbAddCurrentQuestion } = require("../db/fragenQueries");
const { log } = require("../utils/logger");
const { getCurrentQuiz } = require("./fragenEndpoints");

async function getQuizzes(req, res) {
    dbGetQuizzes((error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: results })
    });
}

async function getSubQuizzes(req, res) {
    let id = req.params.id;

    dbGetSubQuizzes(id, (suberror, subresults) => {
        if (suberror) {
            return returnHTML(res, 500, { error: suberror })
        }
        dbGetQuizzesByID(id, (quizerror, quizresults) => {
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

async function endQuiz(req, res) {
    let user = req.user.id;
    await closeOpenQuizzes(user, (error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: "" })
    });
}

async function getAllQuizzesSub(req, res) {
    await dbGetAllQuizzes((error, results) => {
        if (error) {
            return returnHTML(res, 500, {error: error})
        }
        let map = [];
        results.forEach((result) => {
            map[result.id] = {
                id: result.id,
                sub: result.sub,
                title: result.title,
                description: result.description,
                children: []
            };
        });

        map.forEach((item) => {
            if (item.sub != null)
                map[item.sub].children.push(item);
        });

        return returnHTML(res, 200, {data: map[req.params.id]})
    });
}

async function getAllQuizzes(req, res) {
    await dbGetAllQuizzes((error, results) => {
        if (error) {
            return returnHTML(res, 500, {error: error})
        }
        return returnHTML(res, 200, {data: results})
    });
}

async function addQuiz(req, res) {
      /**   {
        *       "quizTitle": "",
        *       "quizDescription": "",
        *       "quizSub": 1,
        *   }
        **/
    let { quizTitle, quizDescription, quizSub } = req.body;
    if (!quizTitle || !quizDescription) {
        return returnHTML(res, 400, { error: "MissingParametersError" })
    }
    dbAddQuiz(quizTitle, quizDescription, quizSub, (error, results) => {
        if (error) {
            return returnHTML(res, 500, { error: error })
        }
        return returnHTML(res, 200, { data: results })
    });

}

function deleteQuiz(req, res) {
    dbDeleteQuiz(req.params.id, (error, results) => {

    });
}

module.exports = {
    getQuizzes,
    getSubQuizzes,
    startQuiz,
    getAllQuizzes,
    addQuiz,
    endQuiz,
    getAllQuizzesSub,
    deleteQuiz
};