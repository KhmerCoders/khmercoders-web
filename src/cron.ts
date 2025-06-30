import { KV_TELERAM_MEMBER_COUNT } from './constants';

const KHMERCODERS_TELEGRAM_GROUP_ID = '-1002628888170';

export const handleCloudflareScheduled: ExportedHandlerScheduledHandler<CloudflareEnv> = async (
  event,
  env
) => {
  const { cron } = event;

  if (cron === '0 */2 * * *') {
    if (!env.TELEGRAM_BOT_TOKEN) {
      console.error('Bot token or chat ID is not set in environment variables.');
      return;
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getChatMembersCount?chat_id=${KHMERCODERS_TELEGRAM_GROUP_ID}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch chat members count: ${response.statusText}`);
      }

      const data = (await response.json()) as { ok: boolean; result: number };

      console.log('Telegram group member count:', JSON.stringify(data, null, 2));

      await env.KV.put(KV_TELERAM_MEMBER_COUNT, data.result.toString());
    } catch (error) {
      console.error('Error fetching chat members count:', error);
    }
  }
};
