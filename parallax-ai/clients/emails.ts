import mailgun from "mailgun-js";

const DOMAIN = 'mail.parallaxai.app';
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
if (!MAILGUN_API_KEY) {
    throw new Error('Missing Mailgun API key');
}
const mg = mailgun({apiKey: MAILGUN_API_KEY, domain: DOMAIN, host: "api.eu.mailgun.net"});

export const sendEmail = async (email: string, subject: string, text: string) => {
    const data = {
        from: 'Dias <no-reply@mail.parallaxai.app>',
        to: email,
        subject: `Parallax AI - ${subject}`,
        text: text
    };

    const response = await mg.messages().send(data);
    if (!response.id) {
        throw new Error('Failed to send email');
    }
}

export const sendPaymentSuccessEmail = async (email: string) => {
    await sendEmail(email, 'Payment Success', 'Thank you! Your payment was successful. Your avatars will be available in ~30 minutes, we will send them to you in an additional email.')
}

export const sendAvatars = async (email: string, jobId: string) => {
    await sendEmail(email, 'Avatars Ready', `Thank you once again! Your avatars are ready: https://parallaxai.app/avatars/${jobId}`)
}
