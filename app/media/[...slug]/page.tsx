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
  
  try {
    const path = await getMediaPathById(slug[0]);

    if (!path) {
      console.error(`[MediaPage] No media found for ID: ${slug[0]}`);
      notFound();
    }

    // Convert absolute URLs to relative paths so Next.js redirects can handle them
    const relativePath = convertToRelativePath(path);
    
    console.log(`[MediaPage] Redirecting media ${slug[0]} from ${path} to ${relativePath}`);
    
    permanentRedirect(relativePath);
  } catch (error) {
    console.error(`[MediaPage] Error processing media ${slug[0]}:`, error);
    notFound();
  }
}
