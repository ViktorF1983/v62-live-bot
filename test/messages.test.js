import assert from "node:assert/strict";
import test from "node:test";

import { helpMessage, renderLiveState, startMessage } from "../src/messages.js";

test("onboarding describes commands and responsible use", () => {
  assert.match(startMessage(), /\/live/);
  assert.match(startMessage(), /18\+/);
  assert.match(helpMessage(), /не принимает ставки/);
});

test("renderLiveState escapes API-provided HTML", () => {
  const output = renderLiveState({
    phase: "<LIVE>", tempo: "fast & steady", r: 2, value: 1.4,
    decision: "WAIT", trigger: "none", chase: 0, chase_limit: 100,
  });

  assert.match(output, /&lt;LIVE&gt;/);
  assert.match(output, /fast &amp; steady/);
  assert.doesNotMatch(output, /<LIVE>/);
});
