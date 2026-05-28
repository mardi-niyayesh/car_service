import {join} from "path";

/** get path from node runtime root(process)
 * @param path
 * @returns string
 * @return **join(process.cwd(), ...path);**
 * */
export function getPath(...path: string[]): string {
  return join(process.cwd(), ...path);
}