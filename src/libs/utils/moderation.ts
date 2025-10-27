const POST_CHARACTER_LIMIT = 300;

export function checkContentModeration(content: string): {
  approved: boolean;
  reason?: string;
} {
  if (content.trim().length === 0) {
    return { approved: false, reason: 'Content cannot be empty' };
  }

  if (content.length > POST_CHARACTER_LIMIT) {
    return { approved: false, reason: `Content exceeds ${POST_CHARACTER_LIMIT} characters` };
  }

  return { approved: true };
}
