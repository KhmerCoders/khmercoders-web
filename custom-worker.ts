import { default as handler } from './.open-next/worker.js';
import { handleCloudflareScheduled } from './src/cron';

export default {
  fetch: handler.fetch,
  scheduled: handleCloudflareScheduled,
} satisfies ExportedHandler<CloudflareEnv>;

// The re-export is only required if your app uses the DO Queue and DO Tag Cache
// See https://opennext.js.org/cloudflare/caching for details
// @ts-ignore `.open-next/worker.ts` is generated at build time
export { DOQueueHandler, DOShardedTagCache } from './.open-next/worker.js';
