'use client';
import { trackProfileVisitAction } from '@/server/actions/track';
import { useEffect } from 'react';

export function ProfileTrackingComponent({
  userId,
  eventType = 'pageview',
  articleId,
}: {
  userId: string;
  eventType?: 'pageview' | 'article';
  articleId?: string;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      console.log('Tracking profile visit for user:', userId);
      trackProfileVisitAction({ userId, referrer: window.document.referrer, eventType, articleId })
        .then()
        .catch();
    }
  }, [userId, eventType, articleId]);

  return null;
}
