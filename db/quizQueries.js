const db = require("./db");
const {errorLog, log} = require("../utils/logger");

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

async function closeOpenQuizzes(user, callback1) {
    const conn = (user, callback2) =>
        db.getConnection(async (error, connection) => {
            if (error) {
                errorLog(error);
                return callback2(error, null);
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
                        return callback2(insertResulterror, null);
                    }
                    connection.query(`SELECT LAST_INSERT_ID() AS asd`,
                        (lastIdResulterror, lastIdResult, insertResultfields) => {
                            if (lastIdResulterror) {
                                errorLog(lastIdResulterror);
                                callback2(lastIdResulterror);
                            }
                            const resultid = lastIdResult[0].asd;
                            log("result id "+resultid);
                            connection.commit();
                            connection.release();
                            callback2(null, resultid);
                        })
                }
            );
        });

    const getID = (user, callback3) => db.query(
        `SELECT id FROM CurrentQuizzes WHERE userID = ?`,
        [user],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback3(error, null);
            }
            const quizid = results[0].id;
            log("quizid "+quizid);
            callback3(null,quizid);
        }
    );


    const insertquestions = (resultid, quizid, callback4) =>
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
                    return callback4(error, null);
                }
                callback4();
            }
        );

    const del = (user, callback5) =>
        db.query(
        `DELETE FROM CurrentQuizzes WHERE userID = ?`,
        [user],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback5(error, null);
            }
        }
    );

    conn(user,(error, result1) => {
        if(error)
            return callback1(error, null);
        const resultid = result1;
        getID(user, (error2, result2)=>{
            if(error2)
                return callback1(error2, null);
            const quizid = result2;
            insertquestions(resultid, quizid, (error3)=> {
                if (error3)
                    return callback1(error3, null);
                del(user, (error4) => {
                    if (error4)
                        return callback1(error4, null);
                    callback1();
                });
            });
        });
    });
}

async function dbAddQuiz(title, description, sub, callback) {
    db.query(
        "INSERT INTO `Quizzes` (`sub`, `title`, `description`) VALUES (?, ?, ?)",
        [sub, title, description],
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