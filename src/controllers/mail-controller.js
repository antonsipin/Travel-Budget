const dotenv = require('dotenv')
dotenv.config()
const nodemailer = require("nodemailer")

const renderSendMailForm = (req, res) => {
  res.render('testMail')
}

const sendMail = async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.mailuser,
      pass: process.env.mailpassword
    },
  });

  await transporter.sendMail({
    from: `"From Travel Budget" <${process.env.mailuser}>`,
    to: "testabc.testabc@mail.ru",
    subject: "Here is your report ✔",
    text: "Here is your report",
    html: `Here is your report`
  });

res.redirect('/')
}

module.exports = {
  renderSendMailForm,
  sendMail
}
