import { notFound, permanentRedirect } from "next/navigation";
import { getMediaPathById } from "@/data/drupal/media";

type Props = {
  params: Promise<{ slug: string[] }>;
};

function convertToRelativePath(absoluteUrl: string): string {
  try {
    const url = new URL(absoluteUrl);
    // Extract the path part that starts with /sites/default/files/
    const pathMatch = url.pathname.match(/(\/sites\/default\/files\/.*)$/);
    if (pathMatch) {
      return pathMatch[1];
    }
    // If it doesn't match the expected pattern, return the full pathname
    return url.pathname;
  } catch {
    // If URL parsing fails, assume it's already a relative path
    return absoluteUrl;
  }
}

export default async function MediaPage({ params }: Props) {
  const { slug } = await params;
  console.log(`[MediaPage] Handler called with slug:`, slug);
  
  if (!slug || !slug[0]) {
    console.error(`[MediaPage] Invalid slug:`, slug);
    notFound();
  }
  
  const mediaId = slug[0];
  console.log(`[MediaPage] Looking up media ID: ${mediaId}`);
  
  try {
    const path = await getMediaPathById(mediaId);
    console.log(`[MediaPage] GraphQL returned path:`, path);

    if (!path) {
      console.error(`[MediaPage] No media found for ID: ${mediaId}`);
      notFound();
    }

    // Convert absolute URLs to relative paths so Next.js redirects can handle them
    const relativePath = convertToRelativePath(path);
    console.log(`[MediaPage] Original: ${path}`);
    console.log(`[MediaPage] Converted: ${relativePath}`);
    
    console.log(`[MediaPage] Performing permanentRedirect to: ${relativePath}`);
    permanentRedirect(relativePath);
  } catch (error) {
    // Don't catch redirect errors - they're how Next.js implements redirects
    if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT'))) {
      throw error;
    }
    
    console.error(`[MediaPage] GraphQL or other error:`, error);
    console.error(`[MediaPage] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
    notFound();
  }
}
