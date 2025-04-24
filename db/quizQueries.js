const db = require("./db");
const {errorLog} = require("../utils/logger");

async function dbGetQuizzes(callback) {
    db.query(
        `SELECT q.id, q.sub, q.title, q.description, EXISTS(SELECT s.id FROM Quizzes s WHERE s.sub = q.id) as hasChildren FROM Quizzes q WHERE sub IS NULL`,
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
            return callback(null, results);
        }
    );
}

async function dbGetSubQuizzes(id, callback) {
    db.query(
        `SELECT q.id, q.sub, q.title, q.description, EXISTS(SELECT s.id FROM Quizzes s WHERE s.sub = q.id) as hasChildren FROM Quizzes q WHERE sub=?`,
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

async function dbGetQuizzesByID(id, callback) {
    db.query(
        `SELECT q.id, q.sub, q.title, q.description, EXISTS(SELECT s.id FROM Quizzes s WHERE s.sub = q.id) as hasChildren FROM Quizzes q WHERE id=?`,
        [id],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
            return callback(null, results[0]);
        }
    );
}

async function dbStartQuiz(quizID, userID, quizTime, callback) {
    db.query("DELETE FROM CurrentQuizzes WHERE userID = ?", userID)

    db.getConnection(async (error, connection) => {
        if (error) {
            errorLog(error);
            return callback(error, null);
        }
        connection.beginTransaction();
        connection.query(
            `INSERT INTO CurrentQuizzes (quizID, userID, quizTime) VALUES (?, ?, ?)`,
            [quizID, userID, quizTime],
            (insertResulterror, insertResult, insertResultfields) => {
                if (insertResulterror) {
                    errorLog(insertResulterror);
                    return callback(insertResulterror, null);
                }
                connection.query(`SELECT LAST_INSERT_ID() AS currentQuizID`,
                    (lastIdResulterror, lastIdResult, insertResultfields) => {
                        if (lastIdResulterror) {
                            errorLog(lastIdResulterror);
                        }
                        const currentQuizID = lastIdResult[0].currentQuizID;
                        connection.commit();
                        callback(null, currentQuizID);
                        return connection.release();
                    })
            }
        );
    });
}

async function dbGetAllQuizzes(callback) {
    db.query(
        `SELECT * FROM Quizzes`,
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
            return callback(null, results);
        }
    );
}

async function closeOpenQuizzes(user, callback) {
    let quizid;
    let resultid;

    db.getConnection(async (error, connection) => {
        if (error) {
            errorLog(error);
            return callback(error, null);
        }
        connection.beginTransaction();
        connection.query(
            `INSERT INTO QuizResults (userID, quizID, timespent)
             SELECT
                 userID,
                 quizID,
                 TIMESTAMPDIFF(SECOND, created_at, NOW())
             FROM
                 CurrentQuizzes
             WHERE userID = ?;`,
            [user],
            (insertResulterror, insertResult, insertResultfields) => {
                if (insertResulterror) {
                    errorLog(insertResulterror);
                    return callback(insertResulterror, null);
                }
                connection.query(`SELECT LAST_INSERT_ID() AS quizResultsID`,
                    (lastIdResulterror, lastIdResult, insertResultfields) => {
                        if (lastIdResulterror) {
                            errorLog(lastIdResulterror);
                        }
                        resultid = lastIdResult[0].quizResultsID;
                        connection.commit();
                        connection.release();
                    })
            }
        );
    });


    db.query(
        `SELECT id FROM CurrentQuizzes WHERE userID = ?`,
        [user],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
            quizid = results[0];
        }
    );


    db.query(
        `
            INSERT INTO QuestionResults (resultID, questionID, answer) 
            SELECT
              ?,
              questionID,
              currentInput
            FROM
               CurrentQuestions
            WHERE currentQuizID = ?;
        `,
        [resultid, quizid],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
        }
    );

    db.query(
        `DELETE FROM CurrentQuizzes WHERE userID = ?`,
        [user],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
        }
    );
}

async function dbAddQuiz(title, description, sub, callback) {
    db.query(
        "INSERT INTO `Quizzes` (`id`, `sub`, `title`, `description`) VALUES (NULL, ?, ?, ?)",
        [title, description, sub],
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
    dbGetQuizzes,
    dbGetSubQuizzes,
    dbGetQuizzesByID,
    dbStartQuiz,
    dbGetAllQuizzes,
    dbAddQuiz,
    closeOpenQuizzes
}