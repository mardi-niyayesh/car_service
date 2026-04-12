import path from "node:path";
import {diskStorage} from "multer";
import {UPLOAD_PATH} from "@/main";
import type {BaseException} from "@/types";
import {BadRequestException} from "@nestjs/common";
import {ApiBodyOptions} from "@nestjs/swagger/dist/decorators/api-body.decorator";
import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const CAR_FILE_FIELD_NAME = 'image';
export const CAR_FILE_PATH = `${UPLOAD_PATH}/car`;

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

export const multerOptions: MulterOptions = {
  storage: diskStorage({
    filename(
      _req: Express.Request,
      file: Express.Multer.File,
      callback: (error: (Error | null), filename: string) => void
    ): void {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1000)}${path.extname(file.originalname)}`;
      callback(null, uniqueName);
    },
    destination: CAR_FILE_PATH
  }),
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter(
    _req: Express.Request,
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
          error: 'bad file format'
        } as BaseException),
        false
      );
    }
  }
};