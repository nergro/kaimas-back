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
        `<h1>Welcome!</h1>
        <p><strong>You have been created by administrator</strong><p>
        <p><strong>Your temporary password: </strong> ${password} </p>
        `,
        'Welcome',
        mail
    );

    await transporter.sendMail(mailOptions);
};
