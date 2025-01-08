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
        return res.status(404).send({});

    if(!fs.statSync(path).isDirectory()) {
        return res.status(200).send(fs.readFileSync(path));
    }

    let items = fs.readdirSync(path);

    let html = '<ul>';
    items.forEach(item => {
        html += `<li><a href="${join('/',path, item)}">${item}</a></li>`;
    })
    html += '</ul>';

    return res.status(200).send(html);
}


module.exports = {
    update: adminUpdate,
    getLogs: getLogs
};