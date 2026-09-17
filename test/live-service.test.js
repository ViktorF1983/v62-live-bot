import assert from "node:assert/strict";
import test from "node:test";

import { createLiveService } from "../src/live-service.js";

const config = {
  sheetsApiUrl: "https://example.com/live?source=bot",
  sheetsToken: "a token",
  requestTimeoutMs: 1000,
};

const state = {
  phase: "LIVE", tempo: "fast", r: 2, value: 1.4,
  decision: "WAIT", trigger: "none", chase: 0, chase_limit: 100,
};

test("getState safely adds token and returns validated data", async () => {
  const fetchImpl = async (url) => {
    assert.equal(url.searchParams.get("source"), "bot");
    assert.equal(url.searchParams.get("token"), "a token");
    return { ok: true, json: async () => ({ ok: true, data: state }) };
  };

  assert.deepEqual(await createLiveService(config, fetchImpl).getState(), state);
});

test("getState rejects incomplete API data", async () => {
  const fetchImpl = async () => ({ ok: true, json: async () => ({ ok: true, data: {} }) });
  await assert.rejects(createLiveService(config, fetchImpl).getState(), /отсутствуют поля/);
});

test("getState rejects unsuccessful HTTP responses", async () => {
  const fetchImpl = async () => ({ ok: false, status: 503 });
  await assert.rejects(createLiveService(config, fetchImpl).getState(), /HTTP 503/);
});
