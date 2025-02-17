const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const logsDir = path.join(process.cwd(), 'logs');

const daysSaved = 7;

/**
 * a function to return a date in form of a string
 * @returns {string} in format dd-mm-yyyy
 */
function getCurrentDate() {
    return format(new Date(new Date().getTime()+ 60*60*1000), 'dd-mm-yyyy');
}

/**
 * a function to search through all logs and delete those older than daysSaved number of days
 */
function cleanupOldLogs() {
    let directories = fs.readdirSync(logsDir);
    let currentDate = new Date(new Date().getTime()+ 60*60*1000);

    directories.forEach((dir) => {
        let dirPath = path.join(logsDir, dir);
        let dirDate = new Date(dir.split('-').reverse().join('-'));

        let diffTime = Math.abs(currentDate - dirDate);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > daysSaved) {
            fs.rmdirSync(dirPath, { recursive: true });
        }
    });
}

function createLogDirectory() {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }
    let currentDateDir = path.join(logsDir, getCurrentDate());
    if (!fs.existsSync(currentDateDir)) {
        fs.mkdirSync(currentDateDir);
    }
    return currentDateDir;
}

/**
 * a function to log a message to a log file saved for daysSaved number of days
 * @param message
 */
function log(message) {
    let currentDateDir = createLogDirectory();
    let logFile = path.join(currentDateDir, 'logs.log');

    let logMessage = `[${new Date(new Date().getTime()+ 60*60*1000).toISOString()}] ${message}\n`;

    fs.appendFileSync(logFile, logMessage, 'utf8');
}

/**
 * a function to log an error to an error log file saved for daysSaved number of days
 * @param message
 */
function errorLog (message) {
    let currentDateDir = createLogDirectory();
    let errorLogFile = path.join(currentDateDir, 'errors.log');

    let logMessage = `[${new Date(new Date().getTime()+ 60*60*1000).toISOString()}] ERROR: ${message}\n`;

    fs.appendFileSync(errorLogFile, logMessage, 'utf8');
}

setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000);
cleanupOldLogs();

module.exports = {
    log,
    errorLog,
};