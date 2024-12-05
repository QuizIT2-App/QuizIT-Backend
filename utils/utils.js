function returnHTML(res, status, {error, data}) {
    res.status(status).json({
        success: error===undefined,
        error: error,
        data: data
    });
}


module.exports = {returnHTML: returnHTML}