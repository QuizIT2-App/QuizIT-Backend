const db = require("./db");
const { errorLog } = require("../utils/logger");

async function getFriends(id, callback) {
    db.query(
        `SELECT user.* FROM 
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
             ) AS friend 
             JOIN Users user ON friend.id = user.uuid;`,
        [id, id, id],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
            return callback(null, results);
        }
    );
}

async function getPending(id, callback) {
    db.query(
        `SELECT user.* FROM 
             (
                 SELECT DISTINCT id1 AS id 
                 FROM Friends f1 
                 WHERE id2 = ?
                 AND NOT EXISTS 
                 (
                     SELECT 1 FROM Friends f2 
                     WHERE f1.id1 = f2.id2 
                     AND f1.id2 = f2.id1
                 )
             ) AS friend 
             JOIN Users user ON friend.id = user.uuid;`,
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

async function getRequested(id, callback) {
    db.query(
        `SELECT user.* FROM 
             (
                 SELECT DISTINCT id2 AS id 
                 FROM Friends f1 
                 WHERE id1 = ?
                 AND NOT EXISTS 
                 (
                     SELECT 1 FROM Friends f2 
                     WHERE f1.id1 = f2.id2 
                     AND f1.id2 = f2.id1
                 )
             ) AS friend 
             JOIN Users user ON friend.id = user.uuid;`,
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

function addFriend(id1, id2) {
    db.query(
        'INSERT INTO Friends(id1, id2) VALUES(?, ?)',
        [id1, id2],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
            }
        }
    );
}

function deleteFriend(id1, id2) {
    db.query(
        'DELETE FROM Friends WHERE (id1 = ? AND id2 = ?) OR (id1 = ? AND id2 = ?) ',
        [id1, id2, id2, id1],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
            }
        }
    );
}



module.exports = {
    getFriends,
    getPending,
    getRequested,
    addFriend,
    deleteFriend
};