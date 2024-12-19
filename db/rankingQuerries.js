const db = require("./db");
const {getUserByID} = require("./userQueries");

async function getFriendsRanking(id) {
    return new Promise( async (resolve, reject) => {
        db.query('SELECT uuid, displayName as name, punkte, false as isme FROM (SELECT DISTINCT CASE WHEN id1 = ? THEN id2 ELSE id1 END AS id FROM friends f1 WHERE (id1 = ? OR id2 = ?) AND EXISTS (SELECT 1 FROM friends f2 WHERE f1.id1 = f2.id2 AND f1.id2 = f2.id1)) AS friend JOIN User user ON friend.id = user.uuid UNION SELECT uuid, displayName as name, punkte, true as isme FROM User WHERE uuid = ? ORDER BY punkte DESC',
            [id,id,id,id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
}

async function getClassRanking(id) {
    return new Promise( async (resolve, reject) => {
        let user = await getUserByID(id);
        db.query('SELECT uuid, displayName as name, punkte, uuid = ? as isme FROM User WHERE jahrgang = ? AND klasse = ? AND abteilung = ? ORDER BY punkte DESC', [id, user.jahrgang, user.klasse, user.abteilung], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
}

async function getDepartmentRanking(id) {
    return new Promise( async (resolve, reject) => {
        let user = await getUserByID(id);
        db.query('SELECT uuid, displayName as name, punkte, uuid = ? as isme FROM User WHERE abteilung = ? ORDER BY punkte DESC', [id, user.abteilung], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
}

module.exports = {
    getFriendsRanking,
    getClassRanking,
    getDepartmentRanking
}