import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

if (!process.env.NODEMAILER_USER) {
    throw new Error('Invalid/Missing environment variable: "NODEMAILER_USER"')
}

if (!process.env.NODEMAILER_PASS) {
    throw new Error('Invalid/Missing environment variable: "NODEMAILER_PASS"')
}

const user = process.env.NODEMAILER_USER
const pass = process.env.NODEMAILER_PASS

export default async function sendMail({
    to,
    subject,
    text,
    html,
    attachment,
}: {
    to: string,
    subject: string,
    text: string,
    html: string,
    attachment: { filename: string, content: string },
}): Promise<{ message?: string, error?: string }> {
    let options: Mail.Options = {
        from: user,
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: [
            attachment
        ]
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: user,
            pass: pass,
        }
    })

    const server = await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error: any, success: any) {
            if (success) {
                resolve(success)
            }
            reject(error)
        })
    })
    if (!server) {
        return { message: undefined, error: 'Error failed' }
    }

    const success = await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(options, (err, response) => {
            if (err) {
                reject(err)
            } else {
                resolve(response)
            }
        })
    })
    if (!success) {
        return { message: undefined, error: 'Error sending email' }
    }

    return { message: "success", error: undefined }
}
