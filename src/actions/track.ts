'use server';

import crypto from 'crypto';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { headers } from 'next/headers';

export async function trackProfileVisitAction({
  userId,
  referrer,
}: {
  userId: string;
  referrer?: string;
}) {
  const { cf, env } = await getCloudflareContext({ async: true });
  const headerContext = await headers();

  console.log('Tracking profile visit for user:', userId, 'Referrer:', referrer);

  if (cf && headerContext && env.PROFILE_ANALYTICS) {
    const countryCode = cf.country;
    const deviceType = headerContext.get('cf-device-type') || 'unknown';
    const path = headerContext.get('x-url') || '';
    const ipAddress =
      headerContext.get('cf-connecting-ip') || headerContext.get('x-forwarded-for') || 'unknown';

    const uniqueSessionId = crypto.createHash('sha1').update(ipAddress).digest('hex');

    env.PROFILE_ANALYTICS.writeDataPoint({
      indexes: [userId],
      blobs: [
        'pageview', // blob1, event type
        countryCode || '', // blob2
        deviceType, // blob3
        uniqueSessionId, // blob4
        referrer || '', // blob5
        path, // blob6
      ],
    });
  }
}
