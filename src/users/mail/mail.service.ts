import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationMail(mail, link) {
    console.log(process.env.SMTP_USER);
    console.log(process.env.SMTP_PASSWORD);
    console.log(mail);

    await this.mailerService.sendMail({
      to: mail,
      from: process.env.SMTP_USER,
      subject: 'Активация аккаунта',
      html: `
        <div>
        <h1>Для активации перейдите по ссылке</h1>
        <a href="${link}">НАЖМИ МЕНЯ</a>
        </div>
      `,
    });
  }
}
