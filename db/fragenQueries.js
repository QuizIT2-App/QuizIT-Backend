const db = require("./db");

async function dbFragenFromPool(id) {
    try {
        const [result] = await db.query(
            `WITH RECURSIVE fragenDingi AS (
                SELECT id
                FROM Quiz
                WHERE id = ?

                UNION ALL

                SELECT quiz.id
                FROM Quiz quiz
                INNER JOIN fragenDingi fd ON quiz.sub = fd.id
            )
            SELECT f.id,q.title,f.inhalt
            FROM Question f
                INNER JOIN fragenDingi fd ON f.quiz = fd.id
                INNER JOIN Quiz q ON f.quiz = q.id;`,
            [id]
        );
        return result;
    } catch (err) {
        throw err;
    }
}
module.exports = {
    dbFragenFromPool
}