module.exports = function(err, res) {
    res.status(500).json({
        succses: false,
        message: err.message ? err.message : err
    })
}