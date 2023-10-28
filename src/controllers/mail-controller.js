require('dotenv').config()
const nodemailer = require('nodemailer')

const renderSendMailForm = (req, res) => {
  res.render('testMail')
}

const sendMail = async (req, res) => {
  try {
      const { id } = req.query
      const URL = `http://${process.env.HOST}:${process.env.PORT}/newtrip/${id}`

      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT || 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        },
      })

      transporter.verify(function (error, success) {
        if (error) {
          console.log(error)
        } else {
          console.log('Server is ready to take our messages')
        }
      })

  
        const result = await transporter.sendMail({
          from: `"From Travel Budget" <${process.env.MAIL_USER}>`,
          to: `${process.env.MAIL_USER}`,
          subject: 'Here is your report ✔',
          text: `Here is your report`,
          html: `<p>Here is your report: ${URL}</p>`
        })
        if (result.accepted.length) {
          console.log('The report has been sent')
        } else {
          console.log('The report not sent')
        }
        res.redirect('/')
    } catch (e) {
      console.log(e)
    }
}

module.exports = {
  renderSendMailForm,
  sendMail
}
