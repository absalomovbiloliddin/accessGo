# accessgo

nogiron shaxslar uchun maxsus liftli va pandusli furgon taksi xizmati.

## papka strukturasi

- `client/` - mijoz web ilovasi (expo web)
- `backend/` - node.js + express + postgresql api

## ishga tushirish

1. postgresql ni yoqing:

```bash
docker compose up -d
```

2. backend ni tayyorlang:

```bash
cd backend
cp .env.example .env
npm install
npm run db:init
npm run dev
```

3. web client ni ishga tushiring:

```bash
cd client
cp .env.example .env
npm install
npx expo start --web --clear
```

## endpointlar

- `post /auth/register`
- `post /auth/login`
- `post /rides/estimate`
- `post /rides/request`
- `get /rides/active`
- `put /rides/:id/status`
- `get /rides/history`
- `post /payment/initiate`
- `get /driver/earnings`
- websocket event: `driver:location` -> `driver:location:update`

## eslatma

- google maps, click, payme kalitlarini `.env` ichida to'ldiring.
- telefondan test qilinsa `localhost` o'rniga kompyuteringiz ip manzilini yozing.
- `client/.env` ichida `EXPO_PUBLIC_API_BASE_URL` ni backend ishlayotgan manzilga qo'ying (masalan: `http://192.168.1.10:5000`).
