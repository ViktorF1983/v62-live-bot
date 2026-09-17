import assert from "node:assert/strict";
import test from "node:test";

import { loadConfig } from "../src/config.js";

test("loadConfig trims and returns required settings", () => {
  const config = loadConfig({
    BOT_TOKEN: " token ",
    SHEETS_API_URL: " https://example.com/live ",
    SHEETS_TOKEN: " secret ",
  });

  assert.equal(config.botToken, "token");
  assert.equal(config.sheetsApiUrl, "https://example.com/live");
  assert.equal(config.sheetsToken, "secret");
  assert.equal(config.requestTimeoutMs, 8000);
});

test("loadConfig reports all missing variables", () => {
  assert.throws(() => loadConfig({}), /BOT_TOKEN, SHEETS_API_URL, SHEETS_TOKEN/);
});
