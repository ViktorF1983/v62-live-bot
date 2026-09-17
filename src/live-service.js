const REQUIRED_FIELDS = ["phase", "tempo", "r", "value", "decision", "trigger", "chase", "chase_limit"];

export function createLiveService(config, fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== "function") {
    throw new Error("Fetch API недоступен");
  }

  return {
    async getState() {
      const url = new URL(config.sheetsApiUrl);
      url.searchParams.set("token", config.sheetsToken);

      const response = await fetchImpl(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(config.requestTimeoutMs),
      });

      if (!response.ok) {
        throw new Error(`API вернул HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (!payload?.ok) {
        throw new Error(payload?.error || "Нет актуального состояния");
      }

      const missing = REQUIRED_FIELDS.filter((field) => payload.data?.[field] === undefined);
      if (missing.length > 0) {
        throw new Error(`В ответе API отсутствуют поля: ${missing.join(", ")}`);
      }

      return payload.data;
    },
  };
}
