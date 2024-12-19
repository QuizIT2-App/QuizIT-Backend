const {returnHTML} = require("../utils/utils");
const {update} = require('../utils/updateRoutine');

async function adminUpdate(req, res) {
    return returnHTML(res, 200, {data: "test"})
}
module.exports = {
    update: adminUpdate,
};