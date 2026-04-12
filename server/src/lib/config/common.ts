import {join} from "path";
export const isProduction: boolean = process.env.NODE_ENV === "production";

/** get path from node runtime root(process)
 * @param path
 * @returns string
 * @return **join(process.cwd(), ...path);**
 * */
export function getPath(...path: string[]): string {
  return join(process.cwd(), ...path);
}