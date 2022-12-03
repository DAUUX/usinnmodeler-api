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
    resetPasswordMail: async (to, token)=> {
        return await mailTransporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: 'USINN Modeler - Recuperação de senha',
            html: `
                <p>Para redefinir sua senha de acesso ao USINN Modeler, entre no link abaixo e preencha o campo com a nova senha. Caso não tenha realizado esta solicitação, apenas ignore esta mensagem.</p>
            
                <p> Link para redefinição de senha: <a href="${process.env.APP_URL}/redefinir-senha/${token}">${process.env.APP_URL}/redefinir-senha/${token}</a></p>
            `
        })
    }
}