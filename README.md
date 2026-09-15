# ATLAXIS BEAUTY

Интерактивное коммерческое предложение по маркетинговой упаковке проекта. Сайт собран на Next.js 16 и воспроизводит механику полноэкранной презентации: стрелки, клавиатура, свайпы, адреса экранов через hash и адаптивные вертикальные переходы на мобильных устройствах.

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется по адресу [http://localhost:3000](http://localhost:3000).

## Проверка

```bash
npm run lint
npm run typecheck
npm run test:e2e
npm run build
```

## Cloudflare Pages Direct Upload

Проект настроен как статический экспорт. Команда `npm run build` создаёт папку `out`. Её можно загрузить в Cloudflare Pages через Workers & Pages, Create application, Pages, Upload assets.

Для публикации через Git укажите:

- Build command: `npm run build`
- Build output directory: `out`
- Node.js version: `20` или новее

Перед публикацией задайте `NEXT_PUBLIC_SITE_URL` с адресом будущего сайта, чтобы sitemap и Open Graph использовали публичный домен.
