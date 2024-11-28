const db = require("./db");

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

async function getUsers() {
    return new Promise( (resolve, reject) => {
        db.query('SELECT * FROM User', (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

function newUser(displayName, distinguishedName, vorname, nachname, jahrgang, klasse, abteilung, type) {
    db.query('INSERT INTO User (displayName, distinguishedName, vorname, nachname, jahrgang, klasse, abteilung, type) VALUES (?,?,?,?,?,?,?,?)',
        [displayName, distinguishedName, vorname, nachname, jahrgang, klasse, abteilung, type])
}

function updateUserKlasse(id, jahrgang, klasse, abteilung) {
    db.query('UPDATE User SET jahrgang = ?, klasse = ?, abteilung = ? WHERE UUID = ?',
        [jahrgang, klasse, abteilung, id]);
}

async function getQuizes() {
    return new Promise( (resolve, reject) => {
        db.query('SELECT quizID, Quiz.titel, SUM(rating)/COUNT(rating) AS bewertung, SUM(difficulty)/COUNT(difficulty) AS difficulty FROM Quiz JOIN Bewertungen B on Quiz.quizID = B.quiz GROUP BY quiz',
            (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

function getQuizByID(id) {
    return new Promise( (resolve, reject) => {
        db.query('SELECT * FROM Quiz WHERE quizID = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        })
    });
}

function getBewertungByID(id) {
    return new Promise( (resolve, reject) => {
        db.query('SELECT * FROM Bewertungen WHERE bewertungID = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
}

function getFrageByID(id) {
    return new Promise( (resolve, reject) => {
        db.query('SELECT * FROM Fragen WHERE frageID = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
}

module.exports = {userDN: getUserByDN, userID: getUserByID, newUser: newUser,
    updateUser: updateUserKlasse, users: getUsers, quizes: getQuizes};