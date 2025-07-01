const nodemailer = require("nodemailer");
require('dotenv').config()

    const mailTransporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE, 
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })

module.exports = {
    resetPasswordMail: async (to, token, messages)=> {
        return await mailTransporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: `USINN Modeler - ${messages.subject}`,
            html: `
                <p>${messages.body}</p>
            
                <p> ${messages.link} <a href="${process.env.APP_URL}/redefinir-senha/${token}">${process.env.APP_URL}redefinir-senha/${token}</a></p>
            `
        })
    },
    sendLinkMail: async (to, link, username, messages)=>{
        return await mailTransporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: `USINN Modeler - ${messages.subject}`,
            html: `
                <p> ${messages.body} ${username}.</p>
            
                <p> ${messages.link} <a href="${link}">"${messages.openLink}"</a></p>
            `
        })
    }
}