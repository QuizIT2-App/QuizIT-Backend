const db = require("./db");
const mysql = require("mysql2");

async function getUserByDN(dn) {
    try {
        const [result] = await db.query(
            `SELECT * FROM User WHERE distinguishedName = ?`,
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
            `SELECT * FROM User WHERE uuid = ?`,
            [id]
        );
        return result[0];
    } catch (err) {
        throw err;
    }
}

function newUser(displayName, distinguishedName, vorname, nachname, jahrgang, klasse, abteilung, type) {
    db.query('INSERT INTO User (displayName, distinguishedName, vorname, nachname, jahrgang, klasse, abteilung, type) VALUES (?,?,?,?,?,?,?,?)',
        [displayName, distinguishedName, vorname, nachname, jahrgang, klasse, abteilung, type]);
}

function updateUser(id, updates = {}) {
    let toSet = Object.keys(updates)
        .map(key => `${mysql.escapeId(key)} = ?`)
        .join(", ");

    db.query(`UPDATE User SET ${toSet} WHERE uuid = ?`,
        [...Object.values(updates), id]);
}

function deleteUser(id) {
    db.query(`DELETE FROM User WHERE uuid = ?`,[id]);
}

module.exports = {
    getUserByDN,
    getUserByID,
    newUser,
    updateUser,
    deleteUser
};