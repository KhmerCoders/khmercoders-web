'use client';
import { useEffect, useRef } from 'react';
import { transformCloudflareD1 } from '@outerbase/sdk-transform';

interface OuterbaseStudioRequest {
  type: 'query' | 'transaction';
  id: number;
  statement?: string;
  statements?: string[];
}

async function requestD1(databaseName: string, statements: string[]) {
  const r = await fetch('/dev_only/d1/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ databaseName, query: statements }),
  });

  const body: {
    error?: string;
    data: unknown[];
  } = await r.json();

  if (body.error) {
    throw new Error(body.error);
  }

  return body.data;
}

export function D1Browser({ databaseName }: { databaseName: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const contentWindow = iframeRef.current?.contentWindow;

    if (contentWindow) {
      const handler = (e: MessageEvent<OuterbaseStudioRequest>) => {
        if (e.data.type === 'query' && e.data.statement) {
          requestD1(databaseName, [e.data.statement])
            .then(r => {
              contentWindow.postMessage(
                {
                  type: e.data.type,
                  id: e.data.id,
                  data: transformCloudflareD1(r[0]),
                },
                '*'
              );
            })
            .catch(err => {
              contentWindow.postMessage(
                {
                  type: e.data.type,
                  id: e.data.id,
                  error: (err as Error).message,
                },
                '*'
              );
            });
        } else if (e.data.type === 'transaction' && e.data.statements) {
          requestD1(databaseName, e.data.statements)
            .then(r => {
              contentWindow.postMessage(
                {
                  type: e.data.type,
                  id: e.data.id,
                  data: r.map(transformCloudflareD1),
                },
                '*'
              );
            })
            .catch(err => {
              contentWindow.postMessage(
                {
                  type: e.data.type,
                  id: e.data.id,
                  error: (err as Error).message,
                },
                '*'
              );
            });
        }
      };

      window.addEventListener('message', handler);
      return () => window.removeEventListener('message', handler);
    }
  }, [databaseName]);

  return (
    <iframe
      className="border-0 h-screen w-screen fixed top-0 left-0"
      ref={iframeRef}
      allow="clipboard-read; clipboard-write"
      src="https://studio.outerbase.com/embed/turso?theme=dark"
    />
  );
}
