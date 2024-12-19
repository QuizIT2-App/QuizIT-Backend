const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Helper function to get the current date in the format "DD-MM-YYYY"
const getCurrentDate = () => {
    return format(new Date(), 'dd-MM-yyyy');
};

// Function to create a directory for the current date if it doesn't exist
const createLogDirectory = () => {
    const currentDateDir = path.join(logsDir, getCurrentDate());
    if (!fs.existsSync(currentDateDir)) {
        fs.mkdirSync(currentDateDir);
    }
    return currentDateDir;
};

// Function to clean up log directories older than a week
const cleanupOldLogs = () => {
    const directories = fs.readdirSync(logsDir);
    const currentDate = new Date();

    directories.forEach((dir) => {
        const dirPath = path.join(logsDir, dir);
        const dirDate = new Date(dir.split('-').reverse().join('-')); // Convert "DD-MM-YYYY" to Date

        const diffTime = Math.abs(currentDate - dirDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert time difference to days

        if (diffDays > 7) {
            // Delete directory if it's older than a week
            fs.rmdirSync(dirPath, { recursive: true });
            console.log(`Deleted old log directory: ${dir}`);
        }
    });
};

// Function to log messages to logs.log
const log = (message) => {
    const currentDateDir = createLogDirectory();
    const logFile = path.join(currentDateDir, 'logs.log');

    const logMessage = `[${new Date().toISOString()}] ${message}\n`;

    fs.appendFileSync(logFile, logMessage, 'utf8');
};

// Function to log error messages to errors.log
const errorLog = (message) => {
    const currentDateDir = createLogDirectory();
    const errorLogFile = path.join(currentDateDir, 'errors.log');

    const logMessage = `[${new Date().toISOString()}] ERROR: ${message}\n`;

    fs.appendFileSync(errorLogFile, logMessage, 'utf8');
};

// Initialize cleanup and logging by calling cleanupOldLogs every day
setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000); // Run cleanup once a day

// Example usage
log('This is a log message');
errorLog('This is an error message');

module.exports = this;