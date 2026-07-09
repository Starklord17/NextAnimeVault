import type { AnimeProp } from "./types";

/**
 * Small bundled dataset used as a last-resort fallback when every remote
 * provider is unavailable, so the first page never renders completely empty.
 */
export const data: AnimeProp[] = [
  {
    id: "1",
    name: "Bleach",
    image:
      "https://cdn.myanimelist.net/images/anime/3/40451.jpg",
    kind: "TV",
    episodes: 366,
    score: "7.92",
  },
  {
    id: "2",
    name: "Black Clover",
    image:
      "https://cdn.myanimelist.net/images/anime/2/88336.jpg",
    kind: "TV",
    episodes: 170,
    score: "7.16",
  },
  {
    id: "3",
    name: "Dragon Ball",
    image:
      "https://cdn.myanimelist.net/images/anime/1887/135640.jpg",
    kind: "TV",
    episodes: 153,
    score: "8.68",
  },
  {
    id: "4",
    name: "Jujutsu Kaisen",
    image:
      "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    kind: "TV",
    episodes: 24,
    score: "8.78",
  },
  {
    id: "5",
    name: "Fullmetal Alchemist: Brotherhood",
    image:
      "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
    kind: "TV",
    episodes: 64,
    score: "9.24",
  },
  {
    id: "6",
    name: "Naruto",
    image:
      "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    kind: "TV",
    episodes: 220,
    score: "8.3",
  },
  {
    id: "7",
    name: "Gintama",
    image:
      "https://cdn.myanimelist.net/images/anime/10/73274.jpg",
    kind: "TV",
    episodes: 367,
    score: "9.0",
  },
  {
    id: "8",
    name: "One Piece",
    image:
      "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    kind: "TV",
    episodes: 1030,
    score: "8.58",
  },
];
