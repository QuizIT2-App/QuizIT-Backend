const db = require("./db");

async function dbGetQuizes(callback) {
    db.query(
        `SELECT * FROM Quizzes WHERE sub IS NULL`,
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
            return callback(null, results);
        }
    );
}

async function dbGetSubQuizes(id, callback) {
    db.query(
        `SELECT * FROM Quizzes WHERE sub=?`,
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

async function dbGetQuizesByID(id, callback) {
    db.query(
        `SELECT * FROM Quizzes WHERE id=?`,
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
module.exports = {
    dbGetQuizes,
    dbGetSubQuizes,
    dbGetQuizesByID,
    dbStartQuiz
}