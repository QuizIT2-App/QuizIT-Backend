const {returnHTML} = require("../utils/utils");
const {update} = require('../utils/updateRoutine');

async function adminUpdate(req, res) {
    try {
        await update(req, res);
        return returnHTML(res, 200, {data: "Update completed successfully"});
    }catch(err) {
        return returnHTML(res, 500, {error: "something went wrong"});
    }
}
module.exports = {
    update: adminUpdate,
};