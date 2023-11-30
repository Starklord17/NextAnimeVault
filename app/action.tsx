"use server";

import AnimeCard, { AnimeProp } from "@/components/AnimeCard";

/**
 * The function fetchAnime fetches anime data from the Shikimori API and returns an array of AnimeCard
 * components.
 * @param {number} page - The `page` parameter is used to specify the page number of the anime list
 * that you want to fetch. It is used in the API URL to determine which page of anime data to retrieve.
 * @returns The function `fetchAnime` is returning an array of JSX elements. Each element is an
 * `AnimeCard` component with a unique key and props `anime` and `index`.
 */
export const fetchAnime = async (page: number) => {
  const response = await fetch(`https://shikimori.one/api/animes?page=${page}&limit=8&order=popularity`);

  const data = await response.json();

  // console.log(data);

  return data.map((item: AnimeProp, index: number) => (
    <AnimeCard key={item.id} anime={item} index={index} />
  ));
}