export const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://khmercoder.com';

export const USER_UPLOAD_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/dev_only/r2'
    : 'https://cdn.khmercoder.com';

export const KV_TELERAM_MEMBER_COUNT = 'telegram_member_count';
