"use server";

import AnimeCard from "@/components/AnimeCard";
import { fetchAnimeData } from "./providers";

/**
 * Fetch a page of popular anime and render it as a list of AnimeCard elements.
 *
 * Data is resolved by {@link fetchAnimeData}, which tries several public anime
 * APIs in order and falls back to the next one whenever a source is
 * unavailable, so a single failing API never breaks the page.
 *
 * @param page - 1-based page number to fetch.
 */
export const fetchAnime = async (page: number) => {
  const anime = await fetchAnimeData(page);

  return anime.map((item, index) => (
    <AnimeCard key={item.id} anime={item} index={index} />
  ));
};
