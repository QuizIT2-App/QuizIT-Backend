const db = require("./db");

async function dbGetQuizes() {
    try {
        const [result] = await db.query(
            `SELECT * FROM Quiz WHERE sub IS NULL`
        );
        return result;
    } catch (err) {
        throw err;
    }
}

async function dbGetSubQuizes(id) {
    try {
        const [result] = await db.query(
            `SELECT * FROM Quiz WHERE sub=?`,
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
            `SELECT * FROM Quiz WHERE id=?`,
            [id]
        );
        return result[0];
    } catch (err) {
        throw err;
    }
}
module.exports = {
    dbGetQuizes,
    dbGetSubQuizes,
    dbGetQuizesByID,
}