import path from "node:path";
import {diskStorage} from "multer";
import type {Request} from "express";
import type {BaseException} from "@/types";
import {existsSync, mkdirSync} from "node:fs";
import {BadRequestException} from "@nestjs/common";
import {ApiBodyOptions} from "@nestjs/swagger/dist/decorators/api-body.decorator";
import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const CAR_FILE_FIELD_NAME = 'image';

export const carUploadApiBody: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      [CAR_FILE_FIELD_NAME]: {
        type: 'string',
        format: 'binary',
      }
    }
  }
};

export function getMulterOptions(destination: string): MulterOptions {
  if (!existsSync(destination)) {
    mkdirSync(destination, {recursive: true});
  }

  return {
    storage: diskStorage({
      filename(
        req: Request,
        file: Express.Multer.File,
        callback: (error: (Error | null), filename: string) => void
      ): void {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        const uniqueName = `${id}${path.extname(file.originalname)}`;

        callback(null, uniqueName);
      },
      destination
    }),
    limits: {
      fileSize: 1024 * 1024 * 10
    },
    fileFilter(
      _req: Request,
      file: Express.Multer.File,
      callback: (error: (Error | null), acceptFile: boolean) => void
    ): void {
      const allowedFiles = /jpg|jpeg|png|webp/;

      if (allowedFiles.test(path.extname(file.originalname))) {
        callback(null, true);
      } else {
        callback(
          new BadRequestException({
            message: `Only ${allowedFiles} allowed`,
            error: 'Invalid file format'
          } as BaseException),
          false
        );
      }
    }
  };
}