import type { MetadataRoute } from "next";

import { FEATURED_PROJECTS } from "@/content/projects";
import { SITE_URL } from "@/lib/site";

/** Every public page: the four sections, then one page per Featured Project. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/work`, priority: 0.8 },
    { url: `${SITE_URL}/about`, priority: 0.8 },
    { url: `${SITE_URL}/archive`, priority: 0.5 },
    ...FEATURED_PROJECTS.map(({ slug }) => ({ url: `${SITE_URL}/work/${slug}`, priority: 0.7 })),
  ];
}
