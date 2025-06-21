/**
 * R2 Storage Emulation for Development Environment
 *
 * This route provides local R2 storage emulation to ease development workflow.
 * It's only available in development mode and is excluded from production builds.
 *
 * It mimics Cloudflare R2 storage behavior by allowing file retrieval through URL paths.
 * Files are accessed via path segments defined in the dynamic route parameters.
 *
 * Example usage: /dev/r2/images/profile.jpg would retrieve the file at key path "images/profile.jpg"
 */

import { getContentTypeFromExtension } from "@/utils/content-type";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * GET handler for R2 file retrieval
 *
 * This function processes incoming requests for files stored in the R2 storage.
 * It extracts the file path from the URL segments, retrieves the file from storage,
 * and returns it with the appropriate content type headers.
 *
 * @param request - The incoming HTTP request object
 * @param params - The dynamic route parameters containing the file path segments
 * @returns Response with file data or appropriate error message (404, 503)
 */
export async function GET(
  _: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("R2 emulation is only available in development mode.", {
      status: 503, // Service Unavailable
    });
  }

  // Extract and join the path segments to form the complete file key path
  const { key } = await params;
  const keyPath = key.join("/");

  // Get Cloudflare environment bindings for accessing R2 storage
  const { env } = getCloudflareContext();

  // Check if R2 bucket is available in the current environment
  // USER_UPLOADS is our R2 bucket binding defined in wrangler.toml
  if (!env.USER_UPLOADS) {
    return new Response("R2 emulation is not available in this environment.", {
      status: 503, // Service Unavailable
    });
  }

  // Attempt to retrieve the file from R2 storage using the constructed key path
  const file = await env.USER_UPLOADS.get(keyPath);

  // Return 404 if the requested file doesn't exist in the R2 bucket
  if (!file) {
    return new Response("File not found", { status: 404 });
  }

  const extension = keyPath.split(".").pop()?.toLowerCase();

  // Return the file with appropriate headers for proper browser rendering
  return new Response(file.body, {
    headers: {
      "Content-Type": getContentTypeFromExtension(extension ?? ""),
      "Content-Length": file.size.toString(),
    },
  });
}
