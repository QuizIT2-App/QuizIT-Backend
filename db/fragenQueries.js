const { ca } = require("date-fns/locale");
const db = require("./db");

async function dbFragenFromPool(id) {
  try {
    const [result] = await db.query(
      `WITH RECURSIVE fragenDingi AS (
                SELECT id
                FROM Quizzes
                WHERE id = ?

                UNION ALL

                SELECT quiz.id
                FROM Quizzes quiz
                INNER JOIN fragenDingi fd ON quiz.sub = fd.id
            )
            SELECT f.id, f.quiz, f.type, f.title, q.title as quizTitle
            FROM Questions f
                INNER JOIN fragenDingi fd ON f.quiz = fd.id
                INNER JOIN Quizzes q ON f.quiz = q.id;`,
      [id]
    );
    return result;
  } catch (err) {
    throw err;
  }
}

function dbAddCurrentQuestion(currentQuizID, questionID) {
  db.query(
    "INSERT INTO CurrentQuestions (currentQuizID, questionID) VALUES (?,?)",
    [currentQuizID, questionID]
  );
}
module.exports = {
  dbFragenFromPool,
  dbAddCurrentQuestion,
  dbGetCurrentQuiz: async (userID, callback) => {
    db.query(
      "SELECT `CurrentQuestions`.`currentInput` AS input, `CurrentQuestions`.`questionID` AS questDbId FROM `CurrentQuestions` JOIN `CurrentQuizzes` ON `CurrentQuizzes`.`id` = `CurrentQuestions`.`currentQuizID` AND `CurrentQuizzes`.`userID` = ?;",
      [userID],
      (error, results, fields) => {
        if (error) {
          console.error(error);
          return callback(error);
        } else {
          return callback(null, results);
        }
      }
    );
  },
};
