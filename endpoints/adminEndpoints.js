const {returnHTML} = require("../utils/utils");
const {update} = require('../utils/updateRoutine');
const fs = require('fs');


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
        return res.status(200).send(fs.readFileSync(path));
    }

    let items = fs.readdirSync(path);

    return returnHTML(res, 200, {data:items});
}


module.exports = {
    update: adminUpdate,
    getLogs: getLogs
};