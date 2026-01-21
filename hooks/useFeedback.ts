import { FEEDBACK } from "@/lib/api";
import {
  PatientSummary,
  RecommendationApiResponse,
  RecommendationSong,
} from "@/lib/types";
import { safeJson } from "@/utils/safeJson";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

interface UseFeedbackArgs {
  recommendations: RecommendationApiResponse | null;
  patientSummary: PatientSummary | null;
}

interface FeedbackParams {
  categoryKey: string;
  song: RecommendationSong;
  feedbackType: string;
}

export function useFeedback({
  recommendations,
  patientSummary,
}: UseFeedbackArgs) {
  const [feedbackLoadingId, setFeedbackLoadingId] = useState<string | null>(
    null
  );

  const handleFeedback = useCallback(
    async ({ categoryKey, song, feedbackType }: FeedbackParams) => {
      if (!recommendations || !patientSummary) return;

      const buttonId = `${categoryKey}-${song.song_title}-${feedbackType}`;
      setFeedbackLoadingId(buttonId);

      try {
        const response = await fetch(FEEDBACK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: recommendations.session_id,
            feedback_type: feedbackType,
            song: {
              title: song?.title,
              artist: song?.artist,
            },
            condition: recommendations.algorithm_metadata.condition,
            // patientId: patientSummary.session_id,
            // patientInfo: patientSummary,
          }),
        });

        if (response.ok) {
          const colors = {
            like: "text-green-600",
            dislike: "text-red-600",
            skip: "text-orange-600",
          };
          toast.success(
            `Thanks! Your ${feedbackType.toLowerCase()} feedback was recorded.`,
            {
              duration: 5000, // show for 5 seconds
              className:
                colors[feedbackType as keyof typeof colors] ?? "text-green-600",
            }
          );
        }

        if (!response.ok) {
          const payload = await safeJson(response);
          toast.error(
            payload.error ? payload.error : "Failed to record feedback.",
            {
              duration: 5000,
              className: "text-red-600",
            }
          );
        }
        return await response.json();
      } catch (err: any) {
        toast.error(
          err instanceof Error ? err.message : "Failed to record feedback.",
          {
            duration: 5000,
            className: "text-red-600",
          }
        );
      } finally {
        setFeedbackLoadingId(null);
      }
    },
    [recommendations, patientSummary]
  );

  return { handleFeedback, feedbackLoadingId };
}
