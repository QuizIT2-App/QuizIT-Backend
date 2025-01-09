const db = require("./db");

async function dbFragenFromPool(id) {
    try {
        const [result] = await db.query(
            `WITH RECURSIVE fragenDingi AS (
                SELECT id, title
                FROM Quiz
                WHERE id = ?

                UNION ALL

                SELECT quiz.id, quiz.title
                FROM Quiz quiz
                INNER JOIN fragenDingi fd ON quiz.sub = fd.id
            )
             SELECT f.*
             FROM Question f
                INNER JOIN fragenDingi fd ON f.quiz = fd.id;`,
            [id]
        );
        return result[0];
    } catch (err) {
        throw err;
    }
}
module.exports = {
    dbFragenFromPool
}