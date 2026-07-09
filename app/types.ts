/**
 * Normalized anime shape shared across all data providers and the UI.
 * Every provider maps its own API response into this shape so the rest of the
 * app never needs to know which source the data came from.
 */
export interface AnimeProp {
  id: string;
  name: string;
  /** Absolute URL to the cover/poster image. */
  image: string;
  /** Format label, e.g. "TV", "Movie", "OVA". */
  kind: string;
  /** Number of episodes (0 when unknown). */
  episodes: number;
  /** Score formatted for display on a 0–10 scale, e.g. "8.7" ("—" when unknown). */
  score: string;
}
