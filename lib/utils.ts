import { format } from "date-fns";

import type {
  RecommendationPayload,
  RecommendationSong,
  SupportedCondition,
} from "@/lib/types";

const CONDITION_LABELS: Record<SupportedCondition, string> = {
  dementia: "Dementia / Alzheimer's",
  down_syndrome: "Down Syndrome",
  adhd: "ADHD",
};

export function formatCondition(condition: string): string {
  return CONDITION_LABELS[condition as SupportedCondition] ?? condition;
}

export function formatDate(
  value: string | null | undefined,
  fallback = "Unknown"
): string {
  if (!value) return fallback;
  try {
    return format(new Date(value), "PPP");
  } catch {
    return fallback;
  }
}

export function normaliseSong(song: RecommendationSong) {
  const {
    url,
    video_id,
    song_id,
    song_title,
    artist,
    genre,
    year,
    id,
    ...rest
  } = song as any;
  const href =
    url ||
    (video_id ? `https://www.youtube.com/watch?v=${video_id}` : undefined);

  return {
    title: song_title, // Map song_title to title for backward compatibility
    url: href,
    videoId: video_id ?? song_id ?? id ?? null,
    artist,
    genre,
    year,
    ...rest,
  };
}

export function deriveCategories(payload: any) {
  let categories: any[] = [];

  // Handle new backend API response structure
  if (payload.recommendations) {
    const entries = Object.entries(payload.recommendations);

    categories = entries.map(([rawKey, songs]: [string, any]) => {
      const label =
        CATEGORY_LABELS[rawKey] ?? toTitleCase(rawKey.replace(/_/g, " "));
      const normalizedSongs = (songs ?? []).map((song: RecommendationSong) =>
        normaliseSong(song)
      );
      return {
        key: rawKey,
        label,
        songs: normalizedSongs,
        query: undefined,
      };
    });
  } else {
    // Fallback for old structure
    const entries = Object.entries(payload.categories ?? {});

    categories = entries.map(([rawKey, category]: [string, any]) => {
      const label =
        CATEGORY_LABELS[rawKey] ?? toTitleCase(rawKey.replace(/_/g, " "));
      const songs = (category.songs ?? []).map((song: any) =>
        normaliseSong(song)
      );
      return {
        key: rawKey,
        label,
        songs,
        query: category.query,
      };
    });
  }

  // Sort categories: Big Five Personality first, then Country Songs, then others alphabetically
  return categories.sort((a, b) => {
    const priorityOrder = [
      "big_five_personality_recommendations", // Big Five Personality Recommendations - first priority
      "country_songs_recommendations", // Country Songs Recommendations - second priority
      "instruments_recommendations", // Surface instrument picks early
      "cognitive_indicators_recommendations", // Cognitive indicators follow the above priorities
      "natural_elements_recommendations", // Nature-Inspired Music appears after Cognitive Indicators
      "favorite_season_recommendations", // Show seasonal picks after Nature-Inspired Music
    ];

    const aPriority = priorityOrder.indexOf(a.key);
    const bPriority = priorityOrder.indexOf(b.key);

    // If both items have priority positions, sort by priority
    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }

    // If only item a has a priority position, it comes first
    if (aPriority !== -1) {
      return -1;
    }

    // If only item b has a priority position, it comes first
    if (bPriority !== -1) {
      return 1;
    }

    // If neither has priority, sort alphabetically by label
    return a.label.localeCompare(b.label);
  });
}

// const CATEGORY_LABELS: Record<string, string> = {
//   birthplace_country: "Recommended Songs",
//   birthplace_city: "",
//   instruments: "Instrumental Favorites",
//   instruments_recommendations: "Instrument-Based Music",
//   seasonal: "Seasonal Music",
//   natural_elements: "Nature Inspired",
//   favorite_genre: "Favorite Genres",
//   favorite_musician: "Favorite Musician",
//   favorite_musician_recommendations: "Favorite Artist Recommendations",
//   favorite_season_recommendations: "Seasonal Favorites",
//   natural_elements_recommendations: "Nature-Inspired Music",
//   patient_csv_matches: "",
//   therapeutic: "Therapeutic Selections",
//   personality_based: "Personality Match",
//   calming_sensory: "Calming Sensory",
//   concentration: "Focus & Concentration",
//   binaural_beats: "Binaural Beats",
//   relief_study: "Study & Relief",
//   additional_calm: "Additional Calming",
//   additional_focus: "Additional Focus",
//   favorite_genres_recommendations: "",
//   country_songs_recommendations: "",
//   big_five_personality_recommendations:"Favourite Genre Recommendations",
//   cognitive_indicators_recommendations: "Cognitive Indicators",
// };
const CATEGORY_LABELS: Record<string, string> = {
  birthplace_country: "",
  birthplace_city: "",
  instruments: "",
  instruments_recommendations: "",
  seasonal: "",
  natural_elements: " ",
  favorite_genre: " ",
  favorite_musician: " ",
  favorite_musician_recommendations: "",
  favorite_season_recommendations: "",
  natural_elements_recommendations: "",
  patient_csv_matches: "",
  therapeutic: "",
  personality_based: "",
  calming_sensory: "",
  concentration: "",
  binaural_beats: "",
  relief_study: "",
  additional_calm: "",
  additional_focus: "",
  favorite_genres_recommendations: "",
  country_songs_recommendations: "",
  big_five_personality_recommendations: "Prescribed Songs",
  cognitive_indicators_recommendations: "",
};

function toTitleCase(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
