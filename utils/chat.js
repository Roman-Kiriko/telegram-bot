const data  = require('../data.json')

let isAdmin = (userId) => {
    return userId == data.admin;
};

function role(ctx) {
    if (isAdmin(ctx.message.from.id)) {
      ctx.scene.enter("chatAdmin");
    } else {
      ctx.scene.enter("chatUser");
    }
  }

module.exports = {isAdmin, role}