bot.command("live", async (ctx) => {
  try {
    // 1) Проверяем, что переменные реально есть (не печатаем секреты)
    console.log("[ENV] BOT_TOKEN?", !!process.env.BOT_TOKEN);
    console.log("[ENV] SHEETS_API_URL?", !!process.env.SHEETS_API_URL);
    console.log("[ENV] SHEETS_TOKEN?", !!process.env.SHEETS_TOKEN);

    const apiUrl = (process.env.SHEETS_API_URL || "").trim();
    const token = (process.env.SHEETS_TOKEN || "").trim();

    // 2) Если чего-то нет — сразу скажем (без философии)
    if (!apiUrl || !token) {
      console.log("[ERROR] Missing env vars", { apiUrlLen: apiUrl.length, tokenLen: token.length });
      return ctx.reply("Ошибка получения данных");
    }

    // 3) Собираем URL правильно (кодируем токен)
    const url = `${apiUrl}?token=${encodeURIComponent(token)}`;
    console.log("[FETCH] GET", url.slice(0, 80) + "..."); // не палим токен целиком

    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();

    console.log("[FETCH] status", res.status);
    console.log("[FETCH] body_head", text.slice(0, 120)); // первые 120 символов ответа

    // 4) Пробуем распарсить JSON
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
