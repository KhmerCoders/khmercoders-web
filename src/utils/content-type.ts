const extensionToMimeType: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  tar: "application/x-tar",
  gz: "application/gzip",
  pdf: "application/pdf",
};

export function getContentTypeFromExtension(extension: string): string {
  return (
    extensionToMimeType[extension.toLowerCase()] || "application/octet-stream"
  );
}
