const REQUIRED_VARIABLES = ["BOT_TOKEN", "SHEETS_API_URL", "SHEETS_TOKEN"];

export function loadConfig(env = process.env) {
  const missing = REQUIRED_VARIABLES.filter((name) => !env[name]?.trim());

  if (missing.length > 0) {
    throw new Error(`Не заданы обязательные переменные окружения: ${missing.join(", ")}`);
  }

  const apiUrl = new URL(env.SHEETS_API_URL.trim());
  if (!['http:', 'https:'].includes(apiUrl.protocol)) {
    throw new Error("SHEETS_API_URL должен использовать протокол http или https");
  }

  return {
    botToken: env.BOT_TOKEN.trim(),
    sheetsApiUrl: apiUrl.toString(),
    sheetsToken: env.SHEETS_TOKEN.trim(),
    requestTimeoutMs: Number.parseInt(env.REQUEST_TIMEOUT_MS || "8000", 10),
  };
}
