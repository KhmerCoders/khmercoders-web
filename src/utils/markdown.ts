import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { Image } from 'mdast';

export async function getMarkdownImageUrls(markdown: string): Promise<string[]> {
  const tree = unified().use(remarkParse).parse(markdown);

  const urls: string[] = [];

  function walk(node: any) {
    if (node.type === 'image') {
      urls.push((node as Image).url);
    }

    if (node.children) {
      for (const child of node.children) {
        walk(child);
      }
    }
  }

  walk(tree);
  return urls;
}
