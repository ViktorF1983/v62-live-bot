import fetch from "node-fetch";
import { Telegraf } from "telegraf";

const BOT_TOKEN = (process.env.BOT_TOKEN || "").trim();
const SHEETS_API_URL = (process.env.SHEETS_API_URL || "").trim();
const SHEETS_TOKEN = (process.env.SHEETS_TOKEN || "").trim();

const bot = new Telegraf(BOT_TOKEN);

function render(data) {
  return [
    `Фаза: ${data.phase}`,
    `Темп: ${data.tempo}`,
    `R: ${data.r}`,
    `Value: ${data.value}`,
    ``,
    `Решение: ${data.decision}`,
    `Триггер: ${data.trigger}`,
    `Догон: ${data.chase}/10, лимит ${data.chase_limit}`
  ].join("\n");
}

bot.command("live", async (ctx) => {
  try {
    console.log("[ENV] BOT_TOKEN?", !!BOT_TOKEN);
    console.log("[ENV] SHEETS_API_URL?", !!SHEETS_API_URL);
    console.log("[ENV] SHEETS_TOKEN?", !!SHEETS_TOKEN);

    if (!BOT_TOKEN || !SHEETS_API_URL || !SHEETS_TOKEN) {
      console.log("[ERROR] Missing env vars", {
        botTokenLen: BOT_TOKEN.length,
        apiUrlLen: SHEETS_API_URL.length,
        tokenLen: SHEETS_TOKEN.length
      });
      return ctx.reply("Ошибка получения данных");
    }

    const url = `${SHEETS_API_URL}?token=${encodeURIComponent(SHEETS_TOKEN)}`;
    console.log("[FETCH] GET", url.slice(0, 90) + "...");

    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();

    console.log("[FETCH] status", res.status);
    console.log("[FETCH] body_head", text.slice(0, 140));

    const json = JSON.parse(text);

    if (!json.ok) {
      return ctx.reply(json.error || "Нет актуального состояния");
    }

    return ctx.reply(render(json.data));
  } catch (e) {
    console.error("[CATCH]", e);
    return ctx.reply("Ошибка получения данных");
  }
});

bot.launch();
console.log("Bot launched");
