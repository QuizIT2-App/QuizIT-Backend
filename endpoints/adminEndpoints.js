const {returnHTML} = require("../utils/utils");
const {update} = require('../utils/updateRoutine');

async function adminUpdate(req, res) {
    try {
        await update(req, res);
        returnHTML(res, 200, {data: "Update completed successfully"});
    }catch(err) {
        returnHTML(res, 500, {error: "asdasd"});
    }
    process.exit();
}
module.exports = {
    update: adminUpdate,
};