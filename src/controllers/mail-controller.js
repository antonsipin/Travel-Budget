require('dotenv').config()
const nodemailer = require('nodemailer')
const { imgUrl } = require('../utils/index')
const { getHtml, docType, getMailUrl, getLetterHtml } = require('../utils/index')
const SendMailStatus = require('../views/SendMailStatus')

const sendMail = async (req, res) => {
  try {
      const { email, id, tripName, users } = req.body

      const URL = getMailUrl(id)
      const letterHtml = getLetterHtml (imgUrl, URL, tripName, users)

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
          to: `${email}`,
          subject: `Here is your ${tripName} trip report ✔`,
          text: `Hello from Travel Budget! Here is your ${tripName} trip report`,
          html: letterHtml
        })
        if (result.accepted.length) {
          res.write(docType)
          res.end(getHtml(SendMailStatus, {
              error: '',
              email: email ? email : '',
              id: id || '', 
              tripName: tripName || '', 
              users: users || []
          }))
        } else {
          res.write(docType)
          res.end(getHtml(SendMailStatus, {
              error: '',
              email: email ? email : '',
              id: id || '', 
              tripName: tripName || '', 
              users: users || []
          }))
        }
    } catch (e) {
      console.log(e)
    }
}

module.exports = {
  sendMail
}
