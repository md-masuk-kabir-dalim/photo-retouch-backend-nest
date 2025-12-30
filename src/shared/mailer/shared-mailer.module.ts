/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Outlook365',
        host: 'smtp.office365.com',
        port: 587,
        tls: { ciphers: 'SSLv3', rejectUnauthorized: false },
        auth: { user: 'tezeract.test@outlook.com', pass: 'Tez@@123' },
        secure: false,
      },
    }),
  ],
  exports: [MailerModule], // export to make it available in other modules
})
export class SharedMailerModule {}
