require("dotenv").config();
const data = require("../data.json");
const axios = require('axios');

const { Telegraf, Markup, Scenes, session  } = require("telegraf")
const { HttpsProxyAgent } = require("https-proxy-agent");



const SceneGenerate = require('../scenes/SceneGenerate');
const isAdmin = require("../utils/chat");

const chatScene = new SceneGenerate()
const roleAdmin = chatScene.GenAdminScene()
const roleUser = chatScene.GenUserScene()
const chat = chatScene.GenChatScene()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const stage = new Scenes.Stage([roleAdmin, roleUser, chat])

bot.use(Telegraf.log())

bot.use(session())
bot.use(stage.middleware())


function role(ctx) {
    if(isAdmin(ctx.message.from.id)) {
      ctx.scene.enter('chatAdmin')
    } else {
      ctx.scene.enter('chatUser')
    }
}


bot.start((ctx) => role(ctx));
bot.help((ctx) => {
  ctx.reply(`/loc  Узнать координаты офиса`)
})


bot.hears("Отправить контакт", (ctx) => {
  return ctx.reply(
    "Информация о себе",
    Markup.keyboard([
      Markup.button.contactRequest("Отправить телефон"),
      Markup.button.locationRequest("Отправить локацию"),
      Markup.button.text("Назад")
    ]).resize()
  );
});


bot.hears("Наши работы", async (ctx) => {
  ctx.reply('Что вас интересует?', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
    Markup.button.text('Мягкие окна'),
    Markup.button.text('Полосовые завесы'),
    Markup.button.text('Тенты'),
    Markup.button.text('Шторы ПВХ')
  ])})
});


bot.hears("Назад", (ctx) => {
  ctx.reply("Вернулись")
  ctx.scene.reenter('chatUser') 
})


bot.hears("Контакты", async (ctx) => {
  ctx.reply(data.addres);
  ctx.reply("Как к нам проехать?");
  await ctx.replyWithPhoto(
    "https://oknatent.ru/wp-content/uploads/2021/01/addres.jpg"
  );
});

bot.hears("Написать менеджеру", (ctx) => {
  ctx.scene.leave('chatUser')
    Markup.removeKeyboard()
      ctx.scene.enter('chat')
});

bot.command('back', ctx => {
  ctx.scene.leave('chat')
  role(ctx)
})
bot.on('sendContact', (ctx) => {
    ctx.reply('Send contact')
})

bot.on('location', (ctx) => {
  axios.put(process.env.BACKEND_URL + '/user', {
    id: ctx.message.from.id,
    location: ctx.message.location
  })
})

bot.on('contact', (ctx) => {
  axios.put(process.env.BACKEND_URL + '/user', {
    id: ctx.message.from.id,
    phone: ctx.message.contact.phone_number
  })
})

bot.command('loc', ctx => {
  ctx.replyWithLocation(55.860959, 37.686392)
})

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
