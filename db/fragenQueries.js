const { ca } = require("date-fns/locale");
const { errorLog, log } = require("../utils/logger");
const db = require("./db");
const e = require("express");

async function dbFragenFromPool(id, callback) {
  db.query(
    `WITH RECURSIVE fragenDingi AS ( SELECT id FROM Quizzes WHERE id = ? UNION ALL SELECT quiz.id FROM Quizzes quiz INNER JOIN fragenDingi fd ON quiz.sub = fd.id ) SELECT f.id, f.quiz, f.type, f.title, q.title as quizTitle FROM Questions f INNER JOIN fragenDingi fd ON f.quiz = fd.id INNER JOIN Quizzes q ON f.quiz = q.id;`,

    [id],
    (error, results, fields) => {
      if (error) {
        errorLog(error);
        return callback(error, null);
      }
      return callback(null, results);
    }
  );
}

function dbAddCurrentQuestion(currentQuizID, questions, callback) {
    const queryString = questions.map(questionID =>
        `INSERT INTO CurrentQuestions (currentQuizID, questionID) VALUES (${currentQuizID}, ${questionID});`
    ).join(' ');

    log(queryString);

    db.query(queryString,
        (error, results, fields) => {
          if (error) {
            errorLog(error);
            return callback(error, null);
          }
          return callback(null, results);
        }
    );

}
module.exports = {
  dbFragenFromPool,
  dbAddCurrentQuestion,
  dbGetCurrentQuiz: async (userID, callback) => {
    try {
      db.query(
        "SELECT `CurrentQuestions`.`currentInput` AS input, `CurrentQuestions`.`questionID` AS questDbId, `Questions`.`type` AS questionType, `Questions`.`title` AS questionTitle FROM `CurrentQuestions` JOIN `CurrentQuizzes` ON `CurrentQuizzes`.`id` = `CurrentQuestions`.`currentQuizID` AND `CurrentQuizzes`.`userID` = ? JOIN `Questions` ON `Questions`.`id` = `CurrentQuestions`.`questionID`;",
        [userID],
        (error, results, fields) => {
          if (error) {
            errorLog(error);
            return callback(error, null);
          }
          if (results.length === 0) {
            return callback("No Data", null);
          }
          log(results);
          return callback(null, results);
        }
      );
    } catch (error) {
      errorLog(error);
      return callback(error, null);
    }
  },
  dbGetCurrentQuizOptions: async (questionId, callback) => {
    try {
      db.query(
        "SELECT * FROM `QuestionOptions` WHERE `questionId` = ?",
        [questionId],
        (error, results, fields) => {
          if (error) {
            errorLog(error);
            return callback(error, null);
          }
          if (results.length === 0) {
            return callback("No Data", null);
          }
          return callback(null, results);
        }
      );
    } catch (error) {
      errorLog(error);
      return callback(error, null);
    }
  },
};
