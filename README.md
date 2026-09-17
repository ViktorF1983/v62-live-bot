# Live Betting Assistant

Telegram-бот для просмотра live-аналитики, получаемой из Google Sheets API. Бот не принимает ставки и не обещает выигрыш.

## Возможности

- `/start` — знакомство с сервисом и предупреждение о рисках;
- `/live` — текущая фаза, темп, value, решение и параметры догона;
- `/help` — справка по командам;
- проверка ответа API, таймаут запросов и безопасный HTML-вывод.

## Запуск

Требуется Node.js 18 или новее.

```bash
npm install
export BOT_TOKEN="telegram-bot-token"
export SHEETS_API_URL="https://example.com/api/live"
export SHEETS_TOKEN="api-secret"
npm start
```

Дополнительно можно задать `REQUEST_TIMEOUT_MS` (по умолчанию `8000`). API должен возвращать JSON следующего вида:

```json
{
  "ok": true,
  "data": {
    "phase": "LIVE",
    "tempo": "high",
    "r": 2,
    "value": 1.35,
    "decision": "WAIT",
    "trigger": "none",
    "chase": 0,
    "chase_limit": 100
  }
}
```

## Проверка

```bash
npm test
```

> Ставки сопряжены с финансовым риском. Используйте сервис ответственно и соблюдайте требования законодательства вашей юрисдикции. 18+.
