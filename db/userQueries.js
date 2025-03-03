const db = require("./db");
const mysql = require("mysql2");

async function getUserByDN(dn) {
    try {
        const [result] = await db.query(
            `SELECT * FROM Users WHERE distinguishedName = ?`,
            [dn]
        );
        return result[0];
    } catch (err) {
        throw err;
    }
}

async function getUserByID(id) {
    try {
        const [result] = await db.query(
            `SELECT * FROM Users WHERE uuid = ?`,
            [id]
        );
        return result[0];
    } catch (err) {
        throw err;
    }
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
    db.query(`DELETE FROM Users WHERE uuid = ?`,[id]);
}

module.exports = {
    getUserByDN,
    getUserByID,
    newUser,
    updateUser,
    deleteUser
};