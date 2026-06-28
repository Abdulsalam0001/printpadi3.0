// ============================================================
// PrintPadi – Home page static data
// Exact port of lib/home-data.ts from Next.js project
// ============================================================

type ExploreLatest = { name: string; link: string; image: string };

/** Carousel banner images (public folder paths) */
export const carouselImages: string[] = [
  '/jhbawut7g13utgu1.png',
  '/jhbawut7g13utgu1.png',
  '/jhbawut7g13utgu1.png',
  '/jhbawut7g13utgu1.png',
];

/**
 * "Explore latest printing & branding" grid items.
 * Images reference Cloudinary public IDs (used with ImageLoaderWithCloudinary
 * in the Next.js project).  In Ionic/Capacitor we serve them from /public
 * or from Cloudinary directly via the full URL helper.
 */
export const exploreLatest: ExploreLatest[] = [
  {
    name:  'new in packaging',
    link:  '/search?tag=packaging',
    image: 'Frame_224_zbcoqs.svg',        // Cloudinary public ID
  },
  {
    name:  'new in bags',
    link:  '/search?tag=bags',
    image: 'bag_hkusq3.svg',
  },
  {
    name:  'new in clothing',
    link:  '/search?tag=clothing',
    image: 'clothing_dnocd8.svg',
  },
  {
    name:  'new in stickers & labels',
    link:  '/search?tag=stickers',
    image: 'stickers_kfdy1o.svg',
  },
  {
    name:  'new in signage & posters',
    link:  '/search?tag=signages-and-display',
    image: 'posters_bnhiep.svg',
  },
  {
    name:  'new in home & gifts',
    link:  '/search?tag=gifts',
    image: 'home_gifts_ctnckg.svg',
  },
];

/**
 * Resolve a Cloudinary public-ID to a full URL.
 * Mirrors what ImageLoaderWithCloudinary does in the Next.js project.
 */
export function cloudinaryUrl(
  publicId: string,
  width = 175,
  height = 182,
): string {
  return `https://res.cloudinary.com/your-cloud-name/image/upload/w_${width},h_${height},c_fill/${publicId}`;
}
