import nodemailer from 'nodemailer';

import { getEnvironmentVariableString } from './environmentVariable';

const mail_user: string = getEnvironmentVariableString('MAIL_USER');
const mail_password: string = getEnvironmentVariableString('MAIL_PASSWORD');
const mail_host: string = getEnvironmentVariableString('MAIL_HOST');
const mail_port: string = getEnvironmentVariableString('MAIL_PORT');
const mail_from_name: string = getEnvironmentVariableString('MAIL_FROM_NAME');
const mail_reply_to: string = getEnvironmentVariableString('MAIL_REPLY_TO');
const mail_reply_to_name: string = getEnvironmentVariableString(
    'MAIL_REPLY_TO_NAME'
);

const transporter: nodemailer.Transporter = nodemailer.createTransport({
    auth: {
        pass: mail_password,
        user: mail_user
    },
    host: mail_host,
    pool: true,
    port: +mail_port
});

interface MailOptions {
    from: string | undefined;
    html: string;
    subject: string;
    to: string;
    replyTo: string;
}

const getMailOptions = (
    template: string,
    subject: string,
    recipient: string
): MailOptions => {
    return {
        from: `${mail_from_name} <${mail_user}>`,
        html: template,
        subject,
        to: recipient,
        replyTo: `${mail_reply_to_name} <${mail_reply_to}>`
    };
};

export const sendNewsletters = async (
    mails: string[],
    content: string,
    subject: string
): Promise<void> => {
    const newsletterMailOptions: MailOptions[] = mails.map((mail) =>
        getMailOptions(content, subject, mail)
    );

    try {
        await Promise.all(
            newsletterMailOptions.map((x) => transporter.sendMail(x))
        );
    } catch (err) {
        console.log('[[ mailError ]]]', err);
    }
};

export const sendPasswordToManager = async (
    mail: string,
    password: string
): Promise<void> => {
    const mailOptions: MailOptions = getMailOptions(
        `<h1>Sveiki!</h1>
        <p><strong>Jums buvo sukurta paskyra Laikas atostogoms sistemoje</strong><p>
        <p><strong>Prisijungimo vardas: </strong> ${mail} </p>
        <p><strong>Laikinas slaptažodis: </strong> ${password} </p>
        `,
        'Sveiki',
        mail
    );

    await transporter.sendMail(mailOptions);
};

export const sendSubscribtionCancellationToken = async (
    mail: string,
    url: string
): Promise<void> => {
    const mailOptions: MailOptions = getMailOptions(
        `<h1>Sveiki!</h1>
        <p><strong>Jūs užsiprenumeravote naujienlaiškį!</strong><p>
        <p><strong>Jei norite atšaukti, spauskite <a href="${url}">čia</a></strong></p>
        <p></p>
        <p><strong>You have subscribed to our newsletter</strong><p>
        <p><strong>If you would like to cancel it just click on this <a href="${url}">link</a></strong></p>
        `,
        'Sveiki',
        mail
    );

    await transporter.sendMail(mailOptions);
};

export const sendSubscribtionCancellationConfirmation = async (
    mail: string
): Promise<void> => {
    const mailOptions: MailOptions = getMailOptions(
        `<h1>Atšaukta!</h1>
        <p><strong>Jūs sėkmingai atšaukėtė naujienlaiškį</strong><p>
        <p></p>
        <p><strong>You have cancelled subscription to our newsletter</strong><p>
        `,
        'Atšaukta',
        mail
    );

    await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmation = async (
    mail: string,
    url: string
): Promise<void> => {
    const mailOptions: MailOptions = getMailOptions(
        `<h1>Sveiki!</h1>
        <p><strong>Jūsų rezervacija sėkminga!</strong><p>
        <p><strong>Jei norite atšaukti, spauskite <a href="${url}">čia</a></strong></p>
        <p</p>
        <p><strong>You have successfully made a reservation.</strong><p>
        <p><strong>If you would like to cancel it just click on this <a href="${url}">link</a></strong></p>
        `,
        'Sveiki',
        mail
    );

    await transporter.sendMail(mailOptions);
};

export const sendOrderCancellationConfirmation = async (
    mail: string
): Promise<void> => {
    const mailOptions: MailOptions = getMailOptions(
        `<h1>Atšaukta!</h1>
        <p><strong>Jūs sėkmingai atšaukėtė rezervaciją.</strong><p>
        <p></p>
        <p><strong>You have successfully cancelled a reservation.</strong><p>
        `,
        'Atšaukta',
        mail
    );

    await transporter.sendMail(mailOptions);
};
