const nodemailer = require("nodemailer");

async function sendMail({to, text}) {
  const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "alina.ibragimova321@gmail.com",
      pass: "Alina.ibragimova123",
    },
  });
  await smtpTransport.sendMail({
    from: '"Oknatent ☎️" <alina.ibragimova321@gmail.com>',
    to,
    subject: "Сообщение от пользователя в Телеграмм",
    text
  });
}

sendMail({
    to: 'okna.alma.seo3@gmail.com',
    text: 'Привет, это Телеграм бот хочу сказать, что тебе написал посетитель'
}).then(()=> console.log('Done')).catch( e => console.log(e))

module.exports = sendMail
