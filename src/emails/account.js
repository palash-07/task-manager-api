const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'sendgrid45@gmail.com',
        subject: 'Thanks for joining us',
        text: `Welcome to the task-app ${name}`       
    })
}

const sendCancelEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'sendgrid45@gmail.com',
        subject: `Goodbye ${name}`,
        text: 'Sorry to see you go. I hope to see you back some time soon'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
