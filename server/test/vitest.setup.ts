import 'reflect-metadata';
import {vi} from "vitest";

vi.mock("@/common/swagger", () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    setupSwagger: () => {},
  };
});