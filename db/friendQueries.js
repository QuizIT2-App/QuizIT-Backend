const db = require("./db");

async function getFriends(id) {
    return new Promise(async (resolve, reject) => {
        db.query('SELECT user.* FROM (SELECT DISTINCT CASE WHEN id1 = ? THEN id2 ELSE id1 END AS id FROM friends f1 WHERE (id1 = ? OR id2 = ?) AND EXISTS (SELECT 1 FROM friends f2 WHERE f1.id1 = f2.id2 AND f1.id2 = f2.id1)) AS friend JOIN User user ON friend.id = user.uuid;',
            [id, id, id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

async function getPending(id) {
    return new Promise(async (resolve, reject) => {
        db.query('SELECT user.* FROM (SELECT DISTINCT CASE WHEN id1 = ? THEN id2 ELSE id1 END AS id FROM friends f1 WHERE (id1 = ? OR id2 = ?) AND NOT EXISTS (SELECT 1 FROM friends f2 WHERE f1.id1 = f2.id2 AND f1.id2 = f2.id1)) AS friend JOIN User user ON friend.id = user.uuid;',
            [id, id, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
    })
}

function addFriend(id1,id2) {
    db.query("INSERT INTO friends(id1, id2) VALUES(?, ?)", [id1, id2]);
}

function deleteFriend(id1, id2) {
}



module.exports = {
    getFriends,
    getPending,
    addFriend,
    deleteFriend
};