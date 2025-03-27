const db = require("./db");
const mysql = require("mysql2");

async function getUserByDN(dn, callback) {
    db.query(
        `SELECT * FROM Users WHERE distinguishedName = ?`,
        [dn],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
            return callback(null, results);
        }
    );
}

async function getUserByID(id, callback) {
    db.query(
        `SELECT * FROM Users WHERE uuid = ?`,
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

function newUser(displayName, distinguishedName, vorname, nachname, jahrgang, klasse, abteilung, type) {
    db.query('INSERT INTO Users (displayName, distinguishedName, vorname, nachname, jahrgang, klasse, abteilung, type) VALUES (?,?,?,?,?,?,?,?)',
        [displayName, distinguishedName, vorname, nachname, jahrgang, klasse, abteilung, type]);
}

function updateUser(id, updates = {}) {
    let toSet = Object.keys(updates)
        .map(key => `${mysql.escapeId(key)} = ?`)
        .join(", ");

    db.query(`UPDATE Users SET ${toSet} WHERE uuid = ?`,
        [...Object.values(updates), id]);
}

function deleteUser(id) {
    db.query(`DELETE FROM Users WHERE uuid = ?`, [id]);
}

module.exports = {
    getUserByDN,
    getUserByID,
    newUser,
    updateUser,
    deleteUser
};