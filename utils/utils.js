function returnHTML(res, status, {error, data}) {
    res.status(status).json({
        success: error===undefined,
        error: error,
        data: data
    });
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


module.exports = {
    returnHTML: returnHTML,
    shuffleArray: shuffleArray
}