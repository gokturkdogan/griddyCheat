# Griddy Games Cheats

Futbol temalı cheat kütüphanesi. **Neon PostgreSQL** + **Cloudinary** (görseller) + **Vercel** deploy.

## Yerel geliştirme

1. `npm install`
2. `.env.example` → `.env`:
   - `DATABASE_URL` (Neon)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. `npm run db:init`
4. `npm run dev` → http://localhost:3000

Upload akışı: dosya **Cloudinary**'e gider → `secure_url` **`lastseven.image_url`** kolonuna yazılır.

## Vercel deploy

1. Repoyu GitHub'a bağla → Vercel'de import.
2. **Environment Variables** (Production + Preview):
   - `DATABASE_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - (opsiyonel) `CLOUDINARY_FOLDER` — varsayılan `griddycheats`
3. Deploy.

Tablo kurulumu (bir kez, yerelden):

```bash
npm run db:init
```

## Tablo `lastseven`

| Kolon       | Tip         |
|------------|-------------|
| id         | serial PK   |
| title      | varchar     |
| image_url  | text (Cloudinary URL) |
| created_at | timestamptz |

## Sayfalar

- `/` — Ana sayfa
- `/son-7-modu-hileleri` — Son 7 modu hile listesi, arama, upload (`/cheats` buraya yönlendirir)
