const { execSync } = require('child_process');
const pm2 = require('pm2');
const {returnHTML} = require("./utils");
const logger = require('logger');

const appName = 'your-app-name'; // PM2 app name

let isMaintenanceMode = false;

function pullLatestCode() {
    //log('Pulling latest code from Git...');
    try {
        execSync('git pull origin main', { stdio: 'inherit' });
    } catch (err) {
        //log('Git pull failed');
        throw err;
    }
}

function installDependencies() {
    //log('Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit' });
    } catch (err) {
        //log('Dependency installation failed');
        throw err;
    }
}

function restartApp() {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                //log('Failed to connect to PM2');
                return reject(err);
            }
            pm2.restart(appName, (err, apps) => {
                if (err) {
                    //log('App restart failed');
                    return reject(err);
                }

                pm2.disconnect();
                //log('App restarted successfully');
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
        //log('Starting update routine...');

        isMaintenanceMode = true;

        pullLatestCode();

        installDependencies();

        await restartApp();

        //log('Update routine completed successfully!');
    } catch (error) {
        //log('An error occurred during the update process: ' + error.message);
    } finally {
        isMaintenanceMode = false;
    }
}

module.exports = {
    update: updateRoutine,
    maintenance: maintenanceMiddleware,
};