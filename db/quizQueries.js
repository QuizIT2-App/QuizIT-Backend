const db = require("./db");

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

module.exports = {
    dbGetQuizzes,
    dbGetSubQuizzes,
    dbGetQuizzesByID,
    dbStartQuiz,
    dbGetAllQuizzes
}