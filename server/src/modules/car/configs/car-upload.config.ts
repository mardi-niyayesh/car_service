import path from "node:path";
import * as fs from "node:fs";
import {diskStorage} from "multer";
import type {Request} from "express";
import {deleteExistingFile} from "@/lib";
import type {BaseException} from "@/types";
import {BadRequestException} from "@nestjs/common";
import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const CAR_FILE_FIELD_NAME = 'image';
export const allowedFileType = /jpg|jpeg|png|webp/;
export const maxFileSize = 1024 * 1024 * 10; // 10 MB

export function getMulterOptions(destination: string): MulterOptions {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, {recursive: true});
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

        deleteExistingFile(destination, id);

        callback(null, uniqueName);
      },
      destination
    }),
    limits: {
      fileSize: maxFileSize
    },
    fileFilter(
      _req: Request,
      file: Express.Multer.File,
      callback: (error: (Error | null), acceptFile: boolean) => void
    ): void {
      if (allowedFileType.test(path.extname(file.originalname))) {
        callback(null, true);
      } else {
        callback(
          new BadRequestException({
            message: `Only ${allowedFileType} allowed`,
            error: 'Invalid file format'
          } as BaseException),
          false
        );
      }
    }
  };
}