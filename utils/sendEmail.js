const nodemailer = require('nodemailer')


const sendEmail =  async options => {
    const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.USER_EMAIL_USERNAME,
              pass: process.env.USER_PASSWORD
            }
          });

    const mailOptions = {
        from : process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    //console.log(options.email)
   // console.log(options.subject)
    //console.log(options.message)
     await transporter.sendMail(mailOptions)
}
module.exports = sendEmail;