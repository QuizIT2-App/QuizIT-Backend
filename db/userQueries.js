const db = require("./db");
const mysql = require("mysql2");
const {errorLog} = require("../utils/logger");

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

function increasePoints(id) {
    db.query(`UPDATE Users SET punkte = punkte + 100 WHERE uuid = ?`, [id])
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

function changeUserName(id,name,callback) {
    db.query(`UPDATE Users SET displayName = ? WHERE uuid = ?`,
        [name, id],
        (error, results, fields) => {
            if (error) {
                errorLog(error);
                return callback(error, null);
            }
            return callback(null, results);
        }
    )
}

module.exports = {
    getUserByDN,
    getUserByID,
    newUser,
    updateUser,
    deleteUser,
    changeUserName,
    increasePoints
};