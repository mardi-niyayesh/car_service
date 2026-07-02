import {eventsEmitter} from "@/common";
import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {OnEvent} from "@nestjs/event-emitter";
import {MailerService} from "@nestjs-modules/mailer";

interface PayloadEventEmail {
  email: string;
  html: string;
  subject?: string;
}

@Injectable()
export class EmailService {
  private readonly defaultFrom: string;
  private readonly defaultReplay: string;
  private readonly emailNotification: string;

  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {
    this.defaultFrom = this.config.get<string>("EMAIL_FROM") ?? "";
    this.defaultReplay = this.config.get<string>("EMAIL_REPLAY") ?? "";
    this.emailNotification = this.config.get<string>("EMAIL_NOTIFICATIONS_ENABLED") ?? "";
  }

  isEmailEnabled(): boolean {
    return this.emailNotification.toLowerCase() === "true";
  }

  @OnEvent(eventsEmitter.SIGNUP_WELCOME)
  @OnEvent(eventsEmitter.LOGIN_WELCOME)
  signupWelcome(payload: PayloadEventEmail) {
    if (!this.isEmailEnabled()) return;

    return this.mailer.sendMail({
      to: payload.email,
      html: payload.html,
      subject: payload.subject,
      replyTo: this.defaultReplay,
      from: this.defaultFrom,
    });
  }

  forgotPassword(to: string, html: string) {
    return this.mailer.sendMail({
      to,
      subject: "Reset Password - Car Service",
      text: "Reset Your password with token",
      html,
      replyTo: this.defaultReplay,
      from: this.defaultFrom,
    });
  }

  @OnEvent(eventsEmitter.PASSWORD_CHANGED)
  passwordChanged(payload: PayloadEventEmail) {
    return this.mailer.sendMail({
      to: payload.email,
      subject: payload.subject || "Your Password Successfully Changed - Car Service",
      html: payload.html,
      replyTo: this.defaultReplay,
      from: this.defaultFrom,
    });
  }
}