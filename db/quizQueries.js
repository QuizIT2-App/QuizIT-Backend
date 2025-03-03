const db = require("./db");

async function dbGetQuizes() {
    try {
        const [result] = await db.query(
            `SELECT * FROM Quizzes WHERE sub IS NULL`
        );
        return result;
    } catch (err) {
        throw err;
    }
}

async function dbGetSubQuizes(id) {
    try {
        const [result] = await db.query(
            `SELECT * FROM Quizzes WHERE sub=?`,
            [id]
        );
        return result;
    } catch (err) {
        throw err;
    }
}

async function dbGetQuizesByID(id) {
    try {
        const [result] = await db.query(
            `SELECT * FROM Quizzes WHERE id=?`,
            [id]
        );
        return result[0];
    } catch (err) {
        throw err;
    }
}

async function dbStartQuiz(quizID, userID, quizTime) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [insertResult] = await connection.query(
            `INSERT INTO CurrentQuizzes (quizID, userID, quizTime) VALUES (?, ?, ?)`,
            [quizID, userID, quizTime]
        );

        const [lastIdResult] = await connection.query(`SELECT LAST_INSERT_ID() AS currentQuizID`);
        const currentQuizID = lastIdResult[0].currentQuizID;

        await connection.commit();
        return currentQuizID;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
module.exports = {
    dbGetQuizes,
    dbGetSubQuizes,
    dbGetQuizesByID,
    dbStartQuiz
}