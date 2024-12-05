const db = require("./db");
const mysql = require("mysql2");

async function getUserByDN(dn) {
    return new Promise( (resolve, reject) => {
        db.query('SELECT * FROM User WHERE distinguishedName = ?', [dn], (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        })
    });
}

async function getUserByID(id) {
    return new Promise( (resolve, reject) => {
        db.query('SELECT * FROM User WHERE UUID = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        })
    });
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