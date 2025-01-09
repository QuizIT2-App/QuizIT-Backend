const {returnHTML} = require("../utils/utils");
const {dbFragenFromPool} = require("../db/fragenQueries");

async function getQuizes(req, res) {
    let items = await dbFragenFromPool(req.params.id);
    return returnHTML(res, 200, {data: items})
}

module.exports = {
    getQuizes
};