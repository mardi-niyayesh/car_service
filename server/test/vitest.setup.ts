import 'reflect-metadata';
import {vi} from "vitest";

vi.mock("@/common", async () => {
  const actual = await vi.importActual("@/common");
  return {
    ...actual,
    getBaseOkResponseSchema: (_args: unknown) => {
      return class MockResponse {};
    },
    getZodErrorBody: (_args: unknown) => {
      return class MockResponse {};
    }
  };
});

vi.mock("@/common/swagger", () => {
  // noinspection JSUnusedGlobalSymbols
  return {
    setupSwagger: () => {},
  };
});