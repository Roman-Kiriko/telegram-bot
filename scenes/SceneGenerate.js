const { Scenes, Markup, Telegraf } = require("telegraf");
const axios = require("axios");
const data = require("../data.json");
const fullName = require("../src/utils/fullName");

const { enter, leave } = Scenes.Stage;

const isAdmin = require("../utils/chat");

class SceneGenerate {
  GenUserScene() {
    const messageUser = new Scenes.BaseScene("chatUser");
    messageUser.enter((ctx) => {
      axios
        .post(`${process.env.BACKEND_URL}/user`, {
          id: ctx.message.from.id,
          name: fullName(
            ctx.message.from.first_name,
            ctx.message.from.last_name
          ),
        })
        .catch((e) => console.log(e));
      ctx.reply(
        `Доброго времени суток, ${ctx.message.from.first_name}! Чем могу помочь? Чтобы узнать команды, введите /help`,
        Markup.keyboard([
          "Наши работы",
          "Отправить контакт",
          "Написать менеджеру",
          "Контакты",
        ])
          .oneTime()
          .resize()
      );
    });
    return messageUser;
  }
  GenAdminScene() {
    const messageAdmin = new Scenes.BaseScene("chatAdmin");
    messageAdmin.enter((ctx) => {
      ctx.reply(
        `Доброго времени суток, ${ctx.message.from.first_name}. Режим: Администратор. Пользователи ждут твоего ответа)`,
        Markup.removeKeyboard()
      );
      try {
        enter("chat");
      } catch (e) {
        console.log(e);
      }
    });
    return messageAdmin;
  }
  GenChatScene() {
    const chatScene = new Scenes.BaseScene("chat");
    chatScene.enter((ctx) => {
      ctx.reply(
        "Чем могу вам помочь?",
        Markup.keyboard([Markup.button.text("Назад")])
          .oneTime()
          .resize()
      );
    });
    chatScene.on("message", (ctx) => {
      if (ctx.message.text === "Назад") {
        ctx.scene.enter("chatUser");
      } else {
        // убеждаемся что это админ ответил на сообщение пользователя
        if (
          ctx.message.reply_to_message &&
          ctx.message.reply_to_message.forward_from &&
          isAdmin(ctx.message.from.id)
        ) {
          // отправляем копию пользователю
          ctx.telegram.sendCopy(
            ctx.message.reply_to_message.forward_from.id,
            ctx.message
          );
          // ctx.telegram.copyMessage(
          //   ctx.message.reply_to_message.forward_from.id,
          //   ctx.message.chat.id,
          //   ctx.message.message_id
          // );
        } else {
          // перенаправляем админу
          let forwardToAdmin = async (ctx) => {
            try {
              await ctx.forwardMessage(data.admin, ctx.from.id, ctx.message.id);
            } catch (error) {
              if (!error.response.ok) {
                ctx.reply("Менеджера нет в сети!");
              }
              console.log(error);
            }
          };
          forwardToAdmin(ctx);
        }
      }
    });
    return chatScene;
  }
}

module.exports = SceneGenerate;
