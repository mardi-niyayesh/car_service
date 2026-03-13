/** 1 minutes in milliseconds */
export const ONE_MINUTE_MS = 60_000;

/** static example date for responses */
export const exampleDate = new Date();

/** Get present tense and convert to string */
export const getServerTime = (): string => new Date().toISOString();

/** get local now date */
export function getLocalDate(result: "fa-IR" | "en-CA") {
  return new Date().toLocaleDateString(result);
}