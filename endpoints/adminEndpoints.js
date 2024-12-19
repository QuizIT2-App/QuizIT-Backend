const {returnHTML} = require("../utils/utils");
const {update} = require('../utils/updateRoutine');

async function adminUpdate(req, res) {
    try {
        await update();
        return returnHTML(res, 200, {data: "Update successfully completed"});
    } catch (error) {
        return returnHTML(res, 500, {error: "fuck"})
    }
}
module.exports = {
    update: adminUpdate,
};