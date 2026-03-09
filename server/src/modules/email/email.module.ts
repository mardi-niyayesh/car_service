import {Module} from "@nestjs/common";
import {EmailService} from "./email.service";
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>("EMAIL_HOST"),
          service: config.get<string>("EMAIL_SERVICE"),
          secure: config.get<string>("NODE_ENV") === "production",
          port: 587,
          tls: {
            rejectUnauthorized: false,
          },
          auth: {
            user: config.get<string>("EMAIL_USER"),
            pass: config.get<string>("EMAIL_PASS"),
          },
        },
        defaults: {
          from: config.get<string>("EMAIL_FROM"),
        },
      })
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}