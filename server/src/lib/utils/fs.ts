import path from "node:path";
import * as fs from "node:fs";

/** search to files and deleting file exist */
export function deleteExistingFile(baseDir: string, fileNameWithoutExt: string) {
  let files: fs.Dirent[] = [];

  try {
    files = fs.readdirSync(baseDir, {withFileTypes: true});
  } catch (e) {
    console.error(`Read Dir Error in ${deleteExistingFile.name}`, e);
  }

  for (const dirent of files) {
    if (!dirent.isFile()) continue;

    const file: string = dirent.name;

    if (file.startsWith(fileNameWithoutExt + ".")) {
      const fullPath = path.join(baseDir, file);

      try {
        fs.unlinkSync(fullPath);
        return;
      } catch (e) {
        console.error(`Error while delete "${fullPath}"`, e);
      }
    }
  }
}