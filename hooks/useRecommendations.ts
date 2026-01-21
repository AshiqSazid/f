import { useState } from "react";
import { RECOMMENDATION } from "@/lib/api";
import {
  BigFiveScores,
  IntakeFormValues,
  PatientSummary,
  RecommendationSong,
  SupportedCondition,
} from "@/lib/types";
import toast from "react-hot-toast";

interface RecommendationApiResponse {
  session_id: string;
  patient_summary: PatientSummary;
  big_five_scores: BigFiveScores;
  algorithm_metadata: {
    algorithm: string;
    songs_considered: number;
    features_used: string;
    condition: SupportedCondition;
    timestamp: string;
  };
  recommendations: {
    country_songs_recommendations: RecommendationSong[];
    favorite_genres_recommendations: RecommendationSong[];
    favorite_season_recommendations: RecommendationSong[];
    natural_elements_recommendations: RecommendationSong[];
    cognitive_indicators_recommendations: RecommendationSong[];
    big_five_personality_recommendations: RecommendationSong[];
  };
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
    mode: 'cors',
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.error ?? `Unable to generate recommendations. Status: ${res.status}`);
  }

  return json as T;
}

export function useRecommendations() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [recommendations, setRecommendations] =
    useState<RecommendationApiResponse | null>(null);
  const [patientSummary, setPatientSummary] = useState<PatientSummary | null>(
    null
  );
  const [bigFive, setBigFive] = useState<BigFiveScores | null>(null);

  const submitIntake = async (formData: IntakeFormValues) => {
    setLoading(true);
    setApiError(null);

    try {
      console.log('Submitting to:', RECOMMENDATION);
      console.log('Form data:', formData);

      const data = await postJson<RecommendationApiResponse>(RECOMMENDATION, {
        intake: formData,
      });

      console.log('API response:', data);
      setRecommendations(data);
      setPatientSummary(data.patient_summary);
      setBigFive(data.big_five_scores);
    } catch (err) {
      console.error('API Error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : "Unexpected error generating recommendations.";

      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitIntake,
    loading,
    apiError,
    recommendations,
    patientSummary,
    bigFive,
  };
}
