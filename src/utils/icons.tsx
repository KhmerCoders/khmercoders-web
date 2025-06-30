import { File, Image } from 'lucide-react';

export function renderIconFromContentType(contentType: string) {
  switch (contentType) {
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
      return <Image className="w-5 h-5 text-purple-500" />;
    default:
      return <File className="w-5 h-5" />;
  }
}
