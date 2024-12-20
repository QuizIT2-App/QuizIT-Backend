const { execSync } = require('child_process');
const pm2 = require('pm2');
const {returnHTML} = require("./utils");
const {log} = require('./logger');

let isMaintenanceMode = false;

function pullLatestCode() {
    log('Git pull started');
    try {
        execSync('git pull origin main', { stdio: 'inherit' });
    } catch (err) {
        log('Git pull failed');
        throw err;
    }
    log('Git pull finished');
}

function installDependencies() {
    log('npm install started');
    try {
        execSync('npm install', { stdio: 'inherit' });
    } catch (err) {
        log('npm install failed');
        throw err;
    }
    log('npm install finished');
}

function restartApp() {
    log('App restart started');
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                log('Failed to connect to PM2');
                return reject(err);
            }
            pm2.restart('index.js', (err, apps) => {
                if (err) {
                    log('App restart failed');
                    return reject(err);
                }
                pm2.disconnect();
                resolve(apps);
            });
        });
    });
}

function maintenanceMiddleware(req, res, next) {
    if (isMaintenanceMode) {
        return returnHTML(res, 503, {error: "Server updating"});
    }
    next();
}

async function updateRoutine() {
    try {
        log('Starting update routine:');

        isMaintenanceMode = true;

        pullLatestCode();

        installDependencies();

        await restartApp();

    } catch (error) {
        log('An error occurred during the update process: ' + error.message);
        throw error;
    } finally {
        isMaintenanceMode = false;
    }
}

module.exports = {
    update: updateRoutine,
    maintenance: maintenanceMiddleware,
};