import fetch from "node-fetch";
import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN;
const SHEETS_API_URL = process.env.SHEETS_API_URL;
const SHEETS_TOKEN = process.env.SHEETS_TOKEN;

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
    const url = `${SHEETS_API_URL}?token=${encodeURIComponent(SHEETS_TOKEN)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.ok) {
      return ctx.reply(json.error || "Нет актуального состояния");
    }

    return ctx.reply(render(json.data));
  } catch (e) {
    return ctx.reply("Ошибка получения данных");
  }
});

bot.launch();
