import path from "path";
import {readFileSync} from "fs";
import {getLocalDate} from "@/lib";
import {BaseException, NormalizedClientInfo} from "@/types";
import {InternalServerErrorException} from "@nestjs/common";

interface BuildEmailOptionsBase {
  title: string;
  clientInfo: NormalizedClientInfo;
  siteName?: string;
  siteUrl?: string;
}

interface BuildEmailOptionsWithHtml extends BuildEmailOptionsBase {
  extra?: Record<string, string>;
  contentName?: string;
  contentHtml?: never;
}

interface BuildEmailHtmlOptionsWithoutHtml extends BuildEmailOptionsBase {
  contentHtml?: string;
  contentName?: never;
  extra?: never;
}

type BuildEmailOptions = | BuildEmailOptionsWithHtml | BuildEmailHtmlOptionsWithoutHtml;

export function buildEmailHtml(options: BuildEmailOptions): string {
  const {
    title,
    contentName,
    clientInfo,
    extra = {},
    siteUrl = process.env.CLIENT_ADDRESS!,
    siteName = process.env.CLIENT_NAME!,
    contentHtml,
  } = options;
  try {
    const layoutPath: string = path.join(process.cwd(), "public/html/email.html");
    let html: string = readFileSync(layoutPath, "utf8");

    let content: string = "";

    if (contentName) {
      const contentPath: string = path.join(process.cwd(), `public/html/${contentName}.html`);
      let contentFile: string = readFileSync(contentPath, "utf8");

      for (const key in extra) {
        contentFile = contentFile.replaceAll(`{{${key}}}`, extra[key]);
      }

      content = contentFile;
    } else if (contentHtml) {
      content = contentHtml;
    }

    const clientMap: Record<string, string | null> = {
      ip: clientInfo.ip,
      browser: clientInfo.browser,
      os: clientInfo.os,
      device: clientInfo.device,
      country: clientInfo.country,
      city: clientInfo.city,
      lang: clientInfo.lang
    };

    for (const key in clientMap) {
      html = html.replaceAll(`{{${key}}}`, clientMap[key] ?? "Unknown");
    }

    html = html.replaceAll("{{miladiDate}}", getLocalDate("en-CA"));
    html = html.replaceAll("{{shamsiDate}}", getLocalDate("fa-IR"));

    const now = new Date();
    html = html.replaceAll("{{iranTime}}", now.toLocaleTimeString("fa-IR", {hour12: false, timeZone: "Asia/Tehran"}));
    html = html.replaceAll("{{utcTime}}", now.toUTCString().split(" ")[4]);


    // Replace Title
    html = html.replaceAll("{{title}}", title);

    // Replace Site Info
    html = html.replaceAll("{{siteName}}", siteName);
    html = html.replaceAll("{{siteUrl}}", siteUrl);

    // Replace Main Content
    html = html.replaceAll("{{{content}}}", content);

    return html;
  } catch (e) {
    throw new InternalServerErrorException({
      message: 'Failed to load email template',
      error: (e as Error).message,
    } as BaseException);
  }
}