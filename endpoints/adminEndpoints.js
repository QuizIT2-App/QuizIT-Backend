const {returnHTML} = require("../utils/utils");
const {update} = require('../utils/updateRoutine');
const fs = require('fs');
const {join} = require("path");


function adminUpdate(req, res) {
    returnHTML(res, 200, {data: "Update request sent successfully"});
    update();
}

async function getLogs(req, res) {
    let path = req.path;
    path = path.substring(path.indexOf('admin/')+6);

    if(!fs.existsSync(path))
        return returnHTML(res, 404, {error:"file does not exist"});

    if(!fs.statSync(path).isDirectory()) {
        return returnHTML(res, 200, {data:fs.readFileSync(path, 'utf8')});
    }

    let items = fs.readdirSync(path);

    let data = items.map(item => `"${join('/logs', item)}"\n`).join('');

    return returnHTML(res, 200, {data:data});
}


module.exports = {
    update: adminUpdate,
    getLogs: getLogs
};