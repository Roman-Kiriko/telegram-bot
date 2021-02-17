require("dotenv").config();
const data = require("../data.json");
const axios = require("axios");

const { Telegraf, Markup, Scenes, session } = require("telegraf");

const SceneGenerate = require("../scenes/SceneGenerate");
const {role} = require("../utils/chat");

const chatScene = new SceneGenerate();
const roleAdmin = chatScene.GenAdminScene();
const roleUser = chatScene.GenUserScene();
const chat = chatScene.GenChatScene();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const stage = new Scenes.Stage([roleAdmin, roleUser, chat]);

bot.use(Telegraf.log())
bot.use(session());
bot.use(stage.middleware());


bot.start((ctx) => role(ctx));

bot.help((ctx) => {
  ctx.reply(`/loc  Узнать координаты офиса`);
});

bot.hears("Отправить контакт", (ctx) => {
  return ctx.reply(
    "Информация о себе",
    Markup.keyboard([
      Markup.button.contactRequest("Отправить телефон"),
      Markup.button.locationRequest("Отправить локацию"),
      Markup.button.text("Назад"),
    ]).resize()
  );
});


bot.hears("Наши работы", async (ctx) => {
  ctx.reply("Что вас интересует?", {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback("Полосовые завесы", "zavesy"),
        Markup.button.callback("Мягкие окна", "softWindow"),
      ],
      [
        Markup.button.callback("Тенты", "tenty"),
        Markup.button.callback("Шторы ПВХ", "shtory"),
      ],
    ]),
  });
});

bot.hears("Назад", (ctx) => {
  ctx.reply("Вернулись");
  ctx.scene.enter("chatUser");
});

bot.hears("Контакты", async (ctx) => {
  ctx.reply(data.addres);
  ctx.reply("Как к нам проехать?");
  await ctx.replyWithPhoto(
    "https://oknatent.ru/wp-content/uploads/2021/01/addres.jpg"
  );
});

bot.hears("Написать менеджеру", (ctx) => {
  ctx.scene.leave("chatUser");
  Markup.removeKeyboard();
  ctx.scene.enter("chat");
});

bot.command("back", (ctx) => {
  ctx.scene.leave("chat");
  role(ctx);
});

bot.command("loc", (ctx) => {
  ctx.replyWithLocation(55.860959, 37.686392);
});

bot.on('callback_query', async ctx => {
  for (let photo of data[ctx.callbackQuery.data]) {
    ctx.replyWithPhoto(photo)
  }
}
)

bot.on("sendContact", (ctx) => {
  ctx.reply("Send contact");
});

bot.on("location", (ctx) => {
  axios.put(process.env.BACKEND_URL + "/user", {
    id: ctx.message.from.id,
    location: ctx.message.location,
  });
});


bot.on("contact", (ctx) => {
  axios.put(process.env.BACKEND_URL + "/user", {
    id: ctx.message.from.id,
    phone: ctx.message.contact.phone_number,
  });
});


bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
