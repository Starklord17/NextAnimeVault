/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Image hosts for each anime data provider (see app/providers.ts).
    remotePatterns: [
      // Jikan / MyAnimeList
      { protocol: "https", hostname: "cdn.myanimelist.net" },
      // AniList
      { protocol: "https", hostname: "s4.anilist.co" },
      // Kitsu
      { protocol: "https", hostname: "media.kitsu.io" },
      { protocol: "https", hostname: "media.kitsu.app" },
      // Shikimori
      { protocol: "https", hostname: "shikimori.one" },
      { protocol: "https", hostname: "**.shikimori.one" },
    ],
  },
};

module.exports = nextConfig;
