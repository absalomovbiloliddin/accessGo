# accessgo

nogiron shaxslar uchun maxsus liftli va pandusli furgon taksi xizmati.

## papka strukturasi

- `client/` - mijoz mobil ilovasi (expo)
- `driver/` - haydovchi mobil ilovasi (expo)
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

3. client ni ishga tushiring:

```bash
cd client
npm install
npx expo start --web --clear
```

4. driver ilovasini ishga tushiring:

```bash
cd driver
npm install
npm start
```

## demo driver

- telefon: `+998901112233`
- parol: `Driver123!`

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
