interface EditArticlePageProps {
  params: Promise<{ articleId: string; username: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { articleId, username } = await params;

  return {};
}
