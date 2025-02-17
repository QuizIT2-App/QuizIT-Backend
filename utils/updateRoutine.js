const { execSync } = require('child_process');
const pm2 = require('pm2');
const {returnHTML} = require("./utils");
const {log} = require('./logger');

let isMaintenanceMode = false;

/**
 * a function to get the latest code
 */
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

/**
 * a function to get dependencies
 */
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

/**
 * a function to restart with the new code
 * @returns {Promise<unknown>} the new process
 */
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

/**
 * a switch to stop requests while the application is updating
 * @param req
 * @param res
 * @param next
 */
function maintenanceMiddleware(req, res, next) {
    if (isMaintenanceMode) {
        return returnHTML(res, 503, {error: "Server updating"});
    }
    next();
}

/**
 * the whole update routine in function to simplify calling including setting the maintenance flag
 * @returns {Promise<void>}
 */
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