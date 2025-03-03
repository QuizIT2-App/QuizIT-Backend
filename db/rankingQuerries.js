const db = require("./db");

async function getFriendsRanking(id) {
    try {
        const [result] = await db.query(
            `SELECT uuid, displayName as name, punkte, false as isme FROM 
            (
                SELECT DISTINCT 
                    CASE WHEN id1 = ? 
                    THEN id2 
                    ELSE id1 
                END AS id
                FROM Friends f1 
                WHERE (id1 = ? OR id2 = ?) 
                AND EXISTS 
                (
                    SELECT 1 FROM Friends f2 
                    WHERE f1.id1 = f2.id2 
                    AND f1.id2 = f2.id1
                )
            ) 
            AS friend 
            JOIN Users user ON friend.id = user.uuid 
            UNION 
            SELECT uuid, displayName as name, punkte, true as isme FROM Users WHERE uuid = ? 
            ORDER BY punkte DESC`,
            [id,id,id,id]
        );
        return result;
    } catch (err) {
        throw err;
    }
}

async function getClassRanking(id) {
    try {
        const [result] = await db.query(
            `SELECT uuid, displayName as name, punkte, uuid = ? as isme FROM Users u
            JOIN (SELECT jahrgang, klasse, abteilung FROM Users WHERE uuid = ?) AS me
                ON u.jahrgang = me.jahrgang 
                AND u.klasse = me.klasse 
                AND u.abteilung = me.abteilung
            ORDER BY punkte DESC`,
            [id, id]
        );
        return result;
    } catch (err) {
        throw err;
    }
}

async function getDepartmentRanking(id) {
    try {
        const [result] = await db.query(
            `SELECT uuid, displayName as name, punkte, uuid = ? as isme FROM Users u
            JOIN (SELECT abteilung FROM Users WHERE uuid = ?) AS me
            WHERE u.abteilung = me.abteilung
            ORDER BY punkte DESC`,
            [id, id]
        );
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getFriendsRanking,
    getClassRanking,
    getDepartmentRanking
}