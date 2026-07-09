import type { AnimeProp } from "./types";
import { data as localSeed } from "./_data";

/**
 * Anime data providers with automatic fallback.
 *
 * Each provider fetches one page of popular anime from a different public API
 * and normalizes the response into the shared {@link AnimeProp} shape. If a
 * provider fails (network error, non-2xx status, unexpected payload, or a
 * timeout) the next one in the list is tried, so the app keeps working even
 * when a single upstream API is down, rate-limited or unreachable.
 *
 * All of these APIs are free and require no authentication.
 */

const PAGE_SIZE = 8;
const REQUEST_TIMEOUT_MS = 8000;
// Cache each upstream response for an hour to stay well within rate limits and
// to serve stale-but-usable data if the API later becomes unavailable.
const REVALIDATE_SECONDS = 3600;

/** Format a score onto a 0–10 scale, or "—" when it is missing. */
function formatScore(value: number | null | undefined, scale: 10 | 100): string {
  if (value == null || Number.isNaN(value) || value === 0) return "—";
  const normalized = scale === 100 ? value / 10 : value;
  return normalized.toFixed(2).replace(/\.?0+$/, "");
}

interface Provider {
  name: string;
  fetchPage: (page: number) => Promise<AnimeProp[]>;
}

/** Jikan — the unofficial MyAnimeList REST API (https://docs.api.jikan.moe). */
const jikan: Provider = {
  name: "Jikan (MyAnimeList)",
  fetchPage: async (page) => {
    const res = await fetch(
      `https://api.jikan.moe/v4/top/anime?page=${page}&limit=${PAGE_SIZE}`,
      { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS), next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!res.ok) throw new Error(`Jikan responded with ${res.status}`);
    const json = await res.json();
    return (json.data ?? []).map((item: any) => ({
      id: String(item.mal_id),
      name: item.title_english || item.title || "Unknown",
      image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || "",
      kind: item.type || "TV",
      episodes: item.episodes ?? 0,
      score: formatScore(item.score, 10),
    }));
  },
};

/** AniList — GraphQL API (https://anilist.gitbook.io/anilist-apiv2-docs). */
const anilist: Provider = {
  name: "AniList",
  fetchPage: async (page) => {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(type: ANIME, sort: POPULARITY_DESC) {
            id
            title { english romaji }
            coverImage { large }
            format
            episodes
            averageScore
          }
        }
      }`;
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables: { page, perPage: PAGE_SIZE } }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`AniList responded with ${res.status}`);
    const json = await res.json();
    const media = json.data?.Page?.media;
    if (!Array.isArray(media)) throw new Error("AniList returned an unexpected payload");
    return media.map((item: any) => ({
      id: String(item.id),
      name: item.title?.english || item.title?.romaji || "Unknown",
      image: item.coverImage?.large || "",
      kind: formatAniListFormat(item.format),
      episodes: item.episodes ?? 0,
      score: formatScore(item.averageScore, 100),
    }));
  },
};

function formatAniListFormat(format: string | null | undefined): string {
  if (!format) return "TV";
  const map: Record<string, string> = {
    TV: "TV",
    TV_SHORT: "TV",
    MOVIE: "Movie",
    SPECIAL: "Special",
    OVA: "OVA",
    ONA: "ONA",
    MUSIC: "Music",
  };
  return map[format] ?? format;
}

/** Kitsu — JSON:API (https://kitsu.docs.apiary.io). */
const kitsu: Provider = {
  name: "Kitsu",
  fetchPage: async (page) => {
    const offset = (page - 1) * PAGE_SIZE;
    const res = await fetch(
      `https://kitsu.io/api/edge/anime?page[limit]=${PAGE_SIZE}&page[offset]=${offset}&sort=-userCount`,
      {
        headers: { Accept: "application/vnd.api+json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!res.ok) throw new Error(`Kitsu responded with ${res.status}`);
    const json = await res.json();
    return (json.data ?? []).map((item: any) => {
      const a = item.attributes ?? {};
      return {
        id: String(item.id),
        name: a.canonicalTitle || a.titles?.en || "Unknown",
        image: a.posterImage?.medium || a.posterImage?.original || "",
        kind: formatKitsuSubtype(a.subtype),
        episodes: a.episodeCount ?? 0,
        score: formatScore(a.averageRating ? Number(a.averageRating) : null, 100),
      };
    });
  },
};

function formatKitsuSubtype(subtype: string | null | undefined): string {
  if (!subtype) return "TV";
  return subtype === "movie" ? "Movie" : subtype.toUpperCase();
}

/** Shikimori — the app's original source (https://shikimori.one/api/doc). */
const shikimori: Provider = {
  name: "Shikimori",
  fetchPage: async (page) => {
    const res = await fetch(
      `https://shikimori.one/api/animes?page=${page}&limit=${PAGE_SIZE}&order=popularity`,
      {
        // Shikimori rejects requests without a User-Agent with a 403.
        headers: { "User-Agent": "AnimeVault (https://github.com/Starklord17/NextAnimeVault)" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!res.ok) throw new Error(`Shikimori responded with ${res.status}`);
    const json = await res.json();
    return (json ?? []).map((item: any) => ({
      id: String(item.id),
      name: item.russian || item.name || "Unknown",
      image: item.image?.original ? `https://shikimori.one${item.image.original}` : "",
      kind: (item.kind || "tv").toUpperCase(),
      episodes: item.episodes || item.episodes_aired || 0,
      score: formatScore(item.score ? Number(item.score) : null, 10),
    }));
  },
};

// Ordered by reliability: the first provider that returns anime wins.
const providers: Provider[] = [jikan, anilist, kitsu, shikimori];

/**
 * Fetch a page of popular anime, trying each provider in order until one
 * succeeds. Falls back to a small bundled dataset if every provider fails, so
 * the first page always renders something.
 */
export async function fetchAnimeData(page: number): Promise<AnimeProp[]> {
  for (const provider of providers) {
    try {
      const anime = (await provider.fetchPage(page)).filter((a) => a.image);
      if (anime.length > 0) return anime;
      console.warn(`[anime] ${provider.name} returned no usable results for page ${page}`);
    } catch (error) {
      console.warn(`[anime] ${provider.name} failed:`, (error as Error).message);
    }
  }

  console.warn("[anime] All providers failed; using bundled fallback data.");
  const start = (page - 1) * PAGE_SIZE;
  return localSeed.slice(start, start + PAGE_SIZE);
}
