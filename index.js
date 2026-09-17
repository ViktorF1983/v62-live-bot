import { Telegraf } from "telegraf";

import { loadConfig } from "./src/config.js";
import { createLiveService } from "./src/live-service.js";
import { helpMessage, renderLiveState, startMessage } from "./src/messages.js";

export function createBot({ token, liveService }) {
  const bot = new Telegraf(token);

  bot.start((ctx) => ctx.reply(startMessage(), { parse_mode: "HTML" }));
  bot.help((ctx) => ctx.reply(helpMessage(), { parse_mode: "HTML" }));

  bot.command("live", async (ctx) => {
    try {
      const data = await liveService.getState();
      return ctx.reply(renderLiveState(data), { parse_mode: "HTML" });
    } catch (error) {
      console.error("[live]", error instanceof Error ? error.message : error);
      return ctx.reply("Не удалось получить актуальные данные. Попробуйте ещё раз позже.");
    }
  });

  return bot;
}

async function main() {
  const config = loadConfig();
  const liveService = createLiveService(config);
  const bot = createBot({ token: config.botToken, liveService });

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  await bot.launch();
  console.log("Bot launched");
}

if (process.env.NODE_ENV !== "test") {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
