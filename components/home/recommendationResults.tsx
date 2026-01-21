"use client";
import { useMemo, useState } from "react";
import {
  BigFiveScores,
  PatientSummary,
  RecommendationApiResponse,
  RecommendationSong,
} from "@/lib/types";
import { deriveCategories } from "@/lib/utils";
import {
  ExternalLink,
  FileText,
  FileType2,
  Heart,
  MoveRight,
  Music,
  Target,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import SummaryItem from "./summaryItem";
import Stat from "./stat";
import { useExportReport } from "@/hooks/useExportReport";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import CustomPlayer from "../player/CustomPlayer";
import PlayerModal from "../modal/PlayerModal";

interface RecommendationResultsProps {
  recommendations: RecommendationApiResponse | null;
  patientSummary: PatientSummary | null;
  bigFive: BigFiveScores | null;
  feedbackLoadingId?: string | null;
  onFeedback?: (args: {
    categoryKey: string;
    song: RecommendationSong;
    feedbackType: string;
  }) => Promise<void>;
}

const RecommendationResults = ({
  recommendations,
  patientSummary,
  bigFive,
  feedbackLoadingId,
  onFeedback,
}: RecommendationResultsProps) => {
  if (!recommendations) {
    return null;
  }
  const [exportLoading, setExportLoading] = useState<"pdf" | "docx" | null>(
    null
  );
  const [exportError, setExportError] = useState<string | null>(null);
  // const [feedbackNotice, setFeedbackNotice] = useState<{
  //   message: string;
  //   tone: "success" | "error";
  //   color?: string;
  // } | null>(null);

  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  const closeModal = () => setPlayerUrl(null);
  const openPlayer = (url?: string | null) => {
    if (url) {
      setPlayerUrl(url);
    }
  };

  const categories = useMemo(
    () => deriveCategories(recommendations),
    [recommendations]
  );
  const banditStats = null;

  const RADAR_KEYS = [
    { key: "openness", label: "Openness" },
    { key: "conscientiousness", label: "Conscientiousness" },
    { key: "extraversion", label: "Extraversion" },
    { key: "agreeableness", label: "Agreeableness" },
    { key: "neuroticism", label: "Neuroticism" },
  ] as const;
  const radarData = RADAR_KEYS.map(({ key, label }) => ({
    trait: label,
    value: Number(bigFive?.[key as keyof BigFiveScores] ?? 0),
  }));

  // const downloadReport = async (format: "pdf" | "docx") => {
  //   try {
  //     setExportError(null);
  //     setExportLoading(format);

  //     const response = await fetch(EXPORT, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         format,
  //         // patientInfo,
  //         recommendations,
  //         bigFive,
  //         patientSummary,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const payload = await safeJson(response);
  //       throw new Error(
  //         payload?.error || `Failed to download ${format.toUpperCase()} export.`
  //       );
  //     }

  //     const blob = await response.blob();
  //     const disposition = response.headers.get("content-disposition") || "";
  //     const match = disposition.match(/filename=\"?([^\";]+)\"?/);
  //     const filename = match ? match[1] : `TheramuseRX_report.${format}`;

  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = filename;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Export error:", error);
  //     setExportError(
  //       error instanceof Error ? error.message : "Unable to generate export."
  //     );
  //     toast.error("Unable to generate export.");
  //   } finally {
  //     setExportLoading(null);
  //   }
  // };

  const handleFeedback = async (
    categoryKey: string,
    song: RecommendationSong,
    feedbackType: string
  ) => {
    if (!onFeedback) return;

    const feedbackKey = `${categoryKey}-${
      song.song_title || song.title
    }-${feedbackType}`;

    try {
      await onFeedback({ categoryKey, song, feedbackType });
      setFeedbackGiven((prev) => new Set(prev).add(feedbackKey));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
        {
          duration: 5000,
          className: "text-red-600",
        }
      );
    }
  };

  const { download, isLoading, error, progress, retry, abort } =
    useExportReport();

  const handleDownload = (format: "pdf" | "docx") => {
    // Flatten recommendations from all categories into a single array
    const flatRecommendations = recommendations
      ? Object.values(recommendations.recommendations || {}).flat()
      : [];

    // Add session_id to each recommendation for export
    const recommendationsWithSessionId = flatRecommendations.map((rec: any) => ({
      ...rec,
      session_id: patientSummary?.session_id || patientSummary?.sessionId || "",
    }));

    // Create patient_info object from patientSummary
    const patientInfo = patientSummary
      ? {
          name: patientSummary.name,
          age: patientSummary.age,
          sex: patientSummary.sex,
          condition: patientSummary.condition,
          birthplace_city: patientSummary.birthplace_city,
          birthplace_country: patientSummary.birthplace_country,
          patient_id: patientSummary.patientId || patientSummary.session_id,
          session_id: patientSummary.session_id || patientSummary.sessionId,
        }
      : {};

    download({
      format,
      recommendations: recommendationsWithSessionId,
      bigFive,
      patientSummary,
      patientInfo,
    });
  };

  return (
    <>
      <div className="space-y-10">
        {/* Summary */}
        <div className="rounded-3xl border border-[#E6DED4] bg-white/80 p-4 shadow-lg lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-[#8A6F55]" />
              <div>
                <h2 className="text-xs font-bold text-[#2E2E2E] lg:text-2xl">
                  Personalized Therapy Plan
                </h2>
                <p className="text-[10px] text-[#8B857D] lg:text-sm">
                  Session{" "}
                  {patientSummary?.session_id || patientSummary?.sessionId} •{" "}
                  {recommendations.algorithm_metadata?.songs_considered ?? 0}{" "}
                  curated tracks
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-[#8A6F55] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                onClick={() => handleDownload("pdf")}
                disabled={exportLoading !== null}
              >
                {exportLoading === "pdf" ? (
                  <span className="btn-spinner" aria-hidden />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                Download PDF
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-[#8A6F55] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                onClick={() => handleDownload("docx")}
                disabled={exportLoading !== null}
              >
                {exportLoading === "docx" ? (
                  <span className="btn-spinner" aria-hidden />
                ) : (
                  <FileType2 className="h-4 w-4" />
                )}
                Download DOCX
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SummaryItem label="Patient" value={patientSummary?.name} />
            <SummaryItem label="Age" value={patientSummary?.age.toString()} />
            <SummaryItem
              label="Birthplace"
              value={`${patientSummary?.birthplace_city || "-"}, ${
                patientSummary?.birthplace_country || "-"
              }`}
            />
            <SummaryItem label="Sex" value={patientSummary?.sex} />
            {/* <SummaryItem label="Condition" value={formatCondition(patientSummary.condition)} /> */}
            <SummaryItem label="Patient ID" value={patientSummary?.patientId} />
          </div>
        </div>

        {exportError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {exportError}
          </div>
        ) : null}

        {/* Bandit Stats + Patient Context */}
        {banditStats && (
          <div className="grid gap-6 lg:grid-cols-2">
            {banditStats && (
              <div className="rounded-3xl border border-[#E6DED4] bg-white/80 p-6 shadow-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#8A6F55]" />
                  <h3 className="text-lg font-semibold text-[#2E2E2E]">
                    Reinforcement Learning Snapshot
                  </h3>
                </div>
                <dl className="mt-4 grid gap-4 md:grid-cols-3">
                  <Stat label="Interactions" value={0} />
                  <Stat label="Average Reward" value={"0.000"} />
                  <Stat label="Exploration Rate" value={"0.00"} />
                </dl>
                <p className="mt-3 text-xs text-[#8B857D]">
                  Thompson Sampling adaptively balances exploration and
                  exploitation using the latest feedback.
                </p>
              </div>
            )}

            {false && (
              <div className="rounded-3xl border border-[#E6DED4] bg-white/80 p-6 shadow-lg">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-[#8A6F55]" />
                  <h3 className="text-lg font-semibold text-[#2E2E2E]">
                    Patient Context
                  </h3>
                </div>
                <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-gray-900/90 p-4 text-xs text-gray-100">
                  {/* TODO: Add patient context when available from backend */}
                  Patient context data will be displayed here
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Big Five Radar */}
        <div className="rounded-3xl border border-[#E6DED4] bg-white/80 p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-[#2E2E2E]">
            Big Five Personality Profile
          </h3>
          <div className="h-48 lg:h-80 lg:w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={radarData}
                margin={{ top: 10, right: 20, bottom: 120, left: 20 }}
              >
                <PolarGrid stroke="#cbd5f5" />
                <PolarAngleAxis dataKey="trait" stroke="#4b5563" />
                <PolarRadiusAxis domain={[0, 1]} stroke="#cbd5f5" />
                <Radar
                  dataKey="value"
                  stroke="#5B9C96"
                  fill="#5B9C96"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* {feedbackNotice && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedbackNotice.tone === "success"
              ? `border-green-200 bg-green-50 ${
                  feedbackNotice.color || "text-green-700"
                }`
              : `border-red-200 bg-red-50 ${
                  feedbackNotice.color || "text-red-700"
                }`
          }`}
        >
          {feedbackNotice.message}
        </div>
      )} */}

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category) => {
            // Special handling for big_five_personality_recommendations and country_songs_recommendations - show as simple list with full song details
            if (
              category.key === "big_five_personality_recommendations" ||
              category.key === "country_songs_recommendations"
            ) {
              return (
                <div
                  key={category.key}
                  className="rounded-3xl border border-[#E6DED4] bg-white/80 p-4 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-[#2E2E2E] lg:text-xl">
                    {category.label}
                  </h3>
                  <div className="mt-4 space-y-4">
                    {category.songs.map(
                      (song: RecommendationSong, index: number) => (
                        <div
                          key={`${category.key}-${index}`}
                          className="rounded-2xl border border-[#D8C6B6] bg-[#EFE9E2] p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-[#2E2E2E] lg:text-lg">
                                  {song.song_title || song.title}
                                </h4>
                              </div>

                              <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-[#5A5A5A] lg:text-sm">
                                {song.artist && (
                                  <span className="flex items-center gap-1">
                                    <Music className="h-3 w-3" />
                                    {song.artist}
                                  </span>
                                )}
                                {song.genre && (
                                  <span className="inline-block rounded bg-[#E6DED4] px-2 py-1 text-xs text-[#5A5A5A]">
                                    {song.genre}
                                  </span>
                                )}
                                {song.year && (
                                  <span className="text-xs text-[#8B857D]">
                                    {song.year}
                                  </span>
                                )}
                              </div>

                              {song.recommendation_score && (
                                <div className="flex items-center gap-2 text-xs font-medium text-[#8A6F55]">
                                  <Target className="h-3 w-3" />
                                  Match Score:{" "}
                                  {(song.recommendation_score * 100).toFixed(1)}
                                  %
                                </div>
                              )}
                              {song.channel && (
                                <p className="text-sm text-[#8B857D]">
                                  Channel • {song.channel}
                                </p>
                              )}
                              {song.description && (
                                <p className="mt-2 text-sm leading-relaxed text-[#5A5A5A]">
                                  {String(song.description).slice(0, 200)}...
                                </p>
                              )}
                              {song.tempo && (
                                <p className="text-xs text-[#8B857D]">
                                  Tempo: {song.tempo} BPM
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {song.url && (
                                <button
                                  type="button"
                                  // href={song.url}
                                  // target="_blank"
                                  // rel="noopener noreferrer"
                                  onClick={() => openPlayer(song.url)}
                                  className="btn-secondary flex items-center gap-2 text-sm"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Listen
                                </button>
                              )}
                              {song.youtube_url && (
                                <button
                                  type="button"
                                  // href={song.youtube_url}
                                  // target="_blank"
                                  // rel="noopener noreferrer"
                                  onClick={() => openPlayer(song.youtube_url)}
                                  className="btn-secondary flex items-center gap-2 text-sm bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Listen to YouTube
                                </button>
                              )}
                              {song.spotify_url && (
                                <button
                                  type="button"
                                  onClick={() => openPlayer(song.spotify_url)}
                                  className="btn-secondary flex items-center gap-2 text-sm bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Listen to Spotify
                                </button>
                              )}
                            </div>
                          </div>

                          {onFeedback && (
                            <div className="mt-4 flex flex-wrap items-center gap-2 lg:gap-3">
                              <button
                                type="button"
                                className={`feedback-btn like ${
                                  feedbackGiven.has(
                                    `${category.key}-${
                                      song.song_title || song.title
                                    }-like`
                                  )
                                    ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                                    : "bg-white/80 text-[#5A5A5A] border-[#E6DED4] hover:bg-[#F4F1EC]"
                                }`}
                                onClick={() =>
                                  handleFeedback(category.key, song, "like")
                                }
                                disabled={
                                  feedbackLoadingId ===
                                  `${category.key}-${
                                    song.song_title || song.title
                                  }-like`
                                }
                              >
                                <ThumbsUp className="h-4 w-4" />
                                Like
                              </button>
                              <button
                                type="button"
                                className={`feedback-btn dislike ${
                                  feedbackGiven.has(
                                    `${category.key}-${
                                      song.song_title || song.title
                                    }-dislike`
                                  )
                                    ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
                                    : "bg-white/80 text-[#5A5A5A] border-[#E6DED4] hover:bg-[#F4F1EC]"
                                }`}
                                onClick={() =>
                                  handleFeedback(category.key, song, "dislike")
                                }
                                disabled={
                                  feedbackLoadingId ===
                                  `${category.key}-${
                                    song.song_title || song.title
                                  }-dislike`
                                }
                              >
                                <ThumbsDown className="h-4 w-4" />
                                Dislike
                              </button>
                              <button
                                type="button"
                                className={`feedback-btn skip ${
                                  feedbackGiven.has(
                                    `${category.key}-${
                                      song.song_title || song.title
                                    }-skip`
                                  )
                                    ? "bg-orange-500 text-white border-orange-600 hover:bg-orange-600"
                                    : "bg-white/80 text-[#5A5A5A] border-[#E6DED4] hover:bg-[#F4F1EC]"
                                }`}
                                onClick={() =>
                                  handleFeedback(category.key, song, "skip")
                                }
                                disabled={
                                  feedbackLoadingId ===
                                  `${category.key}-${
                                    song.song_title || song.title
                                  }-skip`
                                }
                              >
                                <MoveRight className="h-4 w-4" />
                                Skip
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            }

            // Regular categories - all songs always visible
            return (
              <div
                key={category.key}
                className="rounded-3xl border border-[#E6DED4] bg-white/80 p-4 shadow-sm lg:p-6"
              >
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#2E2E2E] lg:text-xl">
                    {category.label}
                  </h3>
                </div>

                <div className="mt-6 space-y-4">
                    {category.songs.map(
                      (song: RecommendationSong, index: number) => {
                        return (
                          <div
                            key={`${category.key}-${index}`}
                            className="rounded-2xl border border-[#D8C6B6] bg-[#EFE9E2] p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-semibold text-[#2E2E2E] lg:text-lg">
                                    {song.song_title || song.title}
                                  </h4>
                                </div>

                                <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-[#5A5A5A] lg:text-sm">
                                  {song.artist && (
                                    <span className="flex items-center gap-1">
                                      <Music className="h-3 w-3" />
                                      {song.artist}
                                    </span>
                                  )}
                                  {song.genre && (
                                    <span className="inline-block rounded bg-[#E6DED4] px-2 py-1 text-xs text-[#5A5A5A]">
                                      {song.genre}
                                    </span>
                                  )}
                                  {song.year && (
                                    <span className="text-xs text-[#8B857D]">
                                      {song.year}
                                    </span>
                                  )}
                                </div>

                                {song.recommendation_score && (
                                  <div className="flex items-center gap-2 text-xs font-medium text-[#8A6F55]">
                                    <Target className="h-3 w-3" />
                                    Match Score:{" "}
                                    {(song.recommendation_score * 100).toFixed(
                                      1
                                    )}
                                    %
                                  </div>
                                )}
                                {song.channel && (
                                  <p className="text-sm text-[#8B857D]">
                                    Channel • {song.channel}
                                  </p>
                                )}
                                {song.description && (
                                  <p className="mt-2 text-sm leading-relaxed text-[#5A5A5A]">
                                    {String(song.description).slice(0, 200)}...
                                  </p>
                                )}
                                {song.tempo && (
                                  <p className="text-xs text-[#8B857D]">
                                    Tempo: {song.tempo} BPM
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {song.url && (
                                  <button
                                    type="button"
                                    onClick={() => openPlayer(song.url)}
                                    className="btn-secondary flex items-center gap-2 text-sm"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Listen
                                  </button>
                                )}
                                {song.youtube_url && (
                                  <button
                                    type="button"
                                    onClick={() => openPlayer(song.youtube_url)}
                                    className="btn-secondary flex items-center gap-2 text-sm bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Listen to YouTube
                                  </button>
                                )}
                                {song.spotify_url && (
                                  <button
                                    type="button"
                                    onClick={() => openPlayer(song.spotify_url)}
                                    className="btn-secondary flex items-center gap-2 text-sm bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Listen to Spotify
                                  </button>
                                )}
                              </div>
                            </div>

                            {onFeedback && (
                              <div className="mt-4 flex flex-wrap items-center gap-2 lg:gap-3">
                                <button
                                  type="button"
                                  className={`feedback-btn like ${
                                    feedbackGiven.has(
                                      `${category.key}-${
                                        song.song_title || song.title
                                      }-like`
                                    )
                                      ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                                      : "bg-white/80 text-[#5A5A5A] border-[#E6DED4] hover:bg-[#F4F1EC]"
                                  }`}
                                  onClick={() =>
                                    handleFeedback(category.key, song, "like")
                                  }
                                  disabled={
                                    feedbackLoadingId ===
                                    `${category.key}-${
                                      song.song_title || song.title
                                    }-like`
                                  }
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  Like
                                </button>
                                <button
                                  type="button"
                                  className={`feedback-btn dislike ${
                                    feedbackGiven.has(
                                      `${category.key}-${
                                        song.song_title || song.title
                                      }-dislike`
                                    )
                                      ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
                                      : "bg-white/80 text-[#5A5A5A] border-[#E6DED4] hover:bg-[#F4F1EC]"
                                  }`}
                                  onClick={() =>
                                    handleFeedback(
                                      category.key,
                                      song,
                                      "dislike"
                                    )
                                  }
                                  disabled={
                                    feedbackLoadingId ===
                                    `${category.key}-${
                                      song.song_title || song.title
                                    }-dislike`
                                  }
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                  Dislike
                                </button>
                                <button
                                  type="button"
                                  className={`feedback-btn skip ${
                                    feedbackGiven.has(
                                      `${category.key}-${
                                        song.song_title || song.title
                                      }-skip`
                                    )
                                      ? "bg-orange-500 text-white border-orange-600 hover:bg-orange-600"
                                      : "bg-white/80 text-[#5A5A5A] border-[#E6DED4] hover:bg-[#F4F1EC]"
                                  }`}
                                  onClick={() =>
                                    handleFeedback(category.key, song, "skip")
                                  }
                                  disabled={
                                    feedbackLoadingId ===
                                    `${category.key}-${
                                      song.song_title || song.title
                                    }-skip`
                                  }
                                >
                                  <MoveRight className="h-4 w-4" />
                                  Skip
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal */}
      {playerUrl && (
        <PlayerModal closeModal={closeModal} playerUrl={playerUrl} />
      )}
    </>
  );
};

export default RecommendationResults;
