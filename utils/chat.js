const data  = require('../data.json')

let isAdmin = (userId) => {
    return userId == data.admin;
};

module.exports = isAdmin