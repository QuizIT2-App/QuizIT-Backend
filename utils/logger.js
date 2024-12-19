const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const logsDir = path.join(__dirname,'/../', 'logs');

const createLogDirectory = () => {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }
    const currentDateDir = path.join(logsDir, format(new Date(new Date().getTime() + 60 * 60 * 1000), 'dd-MM-yyyy'));
    if (!fs.existsSync(currentDateDir)) {
        fs.mkdirSync(currentDateDir);
    }
    return currentDateDir;
};

const cleanupOldLogs = () => {
    const directories = fs.readdirSync(logsDir);
    const currentDate = new Date(new Date().getTime() + 60 * 60 * 1000);

    directories.forEach((dir) => {
        const dirPath = path.join(logsDir, dir);
        const dirDate = new Date(dir.split('-').reverse().join('-'));

        const diffTime = Math.abs(currentDate - dirDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 8 ) {
            fs.rmSync(dirPath, { recursive: true });
        }
    });
};

const log = (message) => {
    const currentDateDir = createLogDirectory();
    const logFile = path.join(currentDateDir, 'logs.log');

    const logMessage = `[${new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()}] ${message}\n`;

    fs.appendFileSync(logFile, logMessage, 'utf8');
};

const errorLog = (message) => {
    const currentDateDir = createLogDirectory();
    const errorLogFile = path.join(currentDateDir, 'errors.log');

    const logMessage = `[${new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()}] ERROR: ${message}\n`;

    fs.appendFileSync(errorLogFile, logMessage, 'utf8');
};

setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000);


module.exports = {
    log,
    errorLog,
    cleanupOldLogs
};