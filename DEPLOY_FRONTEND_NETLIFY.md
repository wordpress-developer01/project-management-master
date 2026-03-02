# Деплой фронтенда (Next.js) на Netlify

Эта инструкция описывает, как задеплоить только фронтенд (папка `client/`) на Netlify.

Коротко — что я уже сделал в репозитории:
- Добавил `client/netlify.toml` с базовой конфигурацией для Netlify + Next.js plugin.
- Локально выполнил `npm run build` в `client/` — билд прошёл успешно.

Требования
- Аккаунт на Netlify
- Репозиторий подключён к GitHub (или другой поддерживаемый провайдер)

Шаги (рекомендуемый простой путь)
1. Подключите сайт на Netlify
   - В Netlify выберите "New site" → "Import from Git" и подключите репозиторий.
   - В поле "Base directory" укажите: `client` (это важно).
   - Build command: `npm run build`
   - Publish directory: `.next`

2. Переменные окружения (Netlify → Site settings → Build & deploy → Environment)
   - NEXT_PUBLIC_API_BASE_URL = https://<your-backend-url>
   - NEXT_PUBLIC_COGNITO_USER_POOL_ID = <your_cognito_user_pool_id>
   - NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = <your_cognito_client_id>

   (Если вы не используете Cognito, оставьте первые две пустыми.)

3. (Рекомендуется) Установить Netlify Next.js plugin как devDependency и закоммитить
   - Это нужно, если ваш проект использует server-side rendering / app router (в вашем билде есть динамический маршрут `ƒ /projects/[id]`). Плагин помогает Netlify корректно обработать серверный рендер и функции.

   В `client/` выполните:

```bash
cd client
npm i -D @netlify/plugin-nextjs
git add package.json package-lock.json
git commit -m "chore: add Netlify Next.js plugin"
git push
```

   Netlify обычно установит плагин в процессе сборки, но явная запись в `package.json` даёт больше предсказуемости.

4. Запустите деплой на Netlify (через UI или push в ветку, привязанную к сайту).

5. Тестирование после деплоя
   - Проверьте публичный URL сайта на Netlify.
   - Убедитесь, что все страницы работают и что клиент корректно вызывает ваш backend (NEXT_PUBLIC_API_BASE_URL).

Доп. заметки
- Если вы хотите полностью статический экспорт (без SSR), можно использовать `next export` и задать `publish` как `out`, но это потребует изменений в приложении (убрать server-side функции и использовать только статическую генерацию).
- Если фронтенд использует AWS Cognito/AWS Amplify, убедитесь, что настройки Cognito (домен/redirect URIs) включают Netlify домен.

Дополнение — ошибка «Auth UserPool not configured» на проде

Если вы видите в продакшне сообщение "Auth UserPool not configured" (как на скриншоте), значит переменные окружения для AWS Cognito не заданы на Netlify или заданы неправильно. Что нужно сделать:

1) Добавьте переменные окружения в Netlify (Site → Site settings → Build & deploy → Environment):
   - NEXT_PUBLIC_COGNITO_USER_POOL_ID = <ваш_user_pool_id>
   - NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = <ваш_user_pool_client_id>
   - (опционально) NEXT_PUBLIC_API_BASE_URL = https://<your-backend-url>

2) Убедитесь, что в AWS Cognito в настройках App client указаны корректные Callback URL и Sign out URL — добавьте `https://<your-site>.netlify.app` (и `https://<your-site>.netlify.app/*` если нужно) в список разрешённых redirect URIs для клиента.

3) Перезапустите деплой на Netlify (Deploys → Trigger deploy → Clear cache and deploy site) чтобы новые env vars подхватились в процессе билда/рантайма.

4) Локально проверить можно так (в корне `client/`):

```bash
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<id> \\
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=<clientId> \\
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 \\
npm run dev
```

Если после этих шагов ошибка останется — пришлите, пожалуйста, скриншот/лог и точный текст ошибок в консоли браузера (DevTools → Console), я посмотрю дальше.

Если хотите, я могу:
- Добавить плагин (`@netlify/plugin-nextjs`) в `client/package.json` и закоммитить изменения.
- Настроить GitHub Action для автоматического деплоя (опционально).
- Помочь пройти процесс подключения репозитория в Netlify (пошагово, в вашем аккаунте).
