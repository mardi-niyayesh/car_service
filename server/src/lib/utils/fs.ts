import path from "node:path";
import * as fs from "node:fs";

/** search to files and deleting file exist */
export function deleteExistingFile(baseDir: string, fileNameWithoutExt: string) {
  const files = fs.readdirSync(baseDir);

  for (const file of files) {
    if (file.startsWith(fileNameWithoutExt + ".")) {
      const fullPath: string = path.join(baseDir, file);

      try {
        fs.unlinkSync(fullPath);
      } catch (e) {
        console.error("Delete File Error: ", e);
      }
    }
  }
}