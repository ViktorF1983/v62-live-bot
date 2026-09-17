function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function startMessage() {
  return [
    "<b>Live Betting Assistant</b>",
    "",
    "Получайте актуальную аналитику матча прямо в Telegram.",
    "Используйте /live для текущего сигнала или /help для справки.",
    "",
    "⚠️ Ставки связаны с финансовым риском. Играйте ответственно и только на средства, которые готовы потерять. 18+.",
  ].join("\n");
}

export function helpMessage() {
  return [
    "<b>Команды</b>",
    "/live — показать актуальное состояние и сигнал",
    "/help — показать эту справку",
    "",
    "Бот предоставляет аналитику, а не гарантирует выигрыш и не принимает ставки.",
  ].join("\n");
}

export function renderLiveState(data) {
  const safe = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, escapeHtml(value)]));

  return [
    "<b>Live-состояние</b>",
    `Фаза: <b>${safe.phase}</b>`,
    `Темп: ${safe.tempo}`,
    `R: ${safe.r}`,
    `Value: ${safe.value}`,
    "",
    `<b>Решение:</b> ${safe.decision}`,
    `<b>Триггер:</b> ${safe.trigger}`,
    `Догон: ${safe.chase}/10 · лимит ${safe.chase_limit}`,
    "",
    "<i>Аналитический сигнал не является гарантией результата. 18+.</i>",
  ].join("\n");
}
