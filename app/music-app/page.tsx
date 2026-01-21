"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import { ArrowRight, Check, ChevronLeft, Loader2 } from "lucide-react";
import RecommendationModal from "@/components/modal/RecommendationModal";
import RecommendationResults from "@/components/home/recommendationResults";
import { useFeedback } from "@/hooks/useFeedback";
import { useRecommendations } from "@/hooks/useRecommendations";
import type { IntakeFormValues } from "@/lib/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const colorVars: CSSProperties = {
  "--canvas": "#F4F1EC",
  "--linen": "#EFE9E2",
  "--sand": "#E6DED4",
  "--clay": "#C6A98A",
  "--umber": "#8A6F55",
  "--blush": "#D8C6B6",
  "--charcoal": "#2E2E2E",
  "--graphite": "#5A5A5A",
  "--ash": "#8B857D",
  "--night": "#1F1C1A",
  "--warm-gray": "#B8B2AC",
} as CSSProperties;

const GENRES = [
  "Classical",
  "Folk",
  "Jazz",
  "Pop",
  "Rabindra Sangeet",
  "Rock",
  "Traditional",
  "Instrumental",
  "Devotional",
  "Ambient",
  "Meditation",
];

const INSTRUMENTS = [
  "Accordion",
  "Acoustic Guitar",
  "Bass Guitar",
  "Bongos",
  "Drum Kit",
  "Drums",
  "Electric Bass",
  "Electric Guitar",
  "Esraj",
  "Flute",
  "Guitar",
  "Harmonium",
  "Keyboard",
  "Saxophone",
  "Synthesizer",
  "Tabla",
  "Tanpura",
  "Violin",
  "Piano",
  "Sitar",
  "Cello",
];

const LANGUAGES = [
  "English",
  "Bengali",
  "Hindi",
  "Urdu",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Mandarin",
  "Japanese",
];

const NATURAL_ELEMENTS = [
  "Rain",
  "Ocean",
  "Forest",
  "Wind",
  "Fireplace",
  "Birdsong",
  "Mountain Breeze",
];

const BIG_FIVE_STATEMENTS = [
  "I see myself as extraverted, enthusiastic",
  "I see myself as critical, quarrelsome",
  "I see myself as dependable, self-disciplined",
  "I see myself as anxious, easily upset",
  "I see myself as open to new experiences, complex",
  "I see myself as reserved, quiet",
  "I see myself as sympathetic, warm",
  "I see myself as disorganized, careless",
  "I see myself as calm, emotionally stable",
  "I see myself as conventional, uncreative",
];

const INITIAL_FORM: IntakeFormValues = {
  name: "",
  sex: "Female",
  birthplaceCity: "",
  birthplaceCountry: "",
  dateOfBirth: "",
  condition: "dementia",
  instruments: [],
  preferredLanguages: ["Bengali"],
  favoriteGenres: [],
  favoriteMusician: "",
  favoriteSeason: "",
  naturalElements: [],
  difficultySleeping: false,
  troubleRemembering: false,
  forgetsEverydayThings: false,
  difficultyRecallingOldMemories: false,
  memoryWorseThanYearAgo: false,
  visitedMentalHealthProfessional: false,
  bigFiveResponses: Array(10).fill(4),
};

type MultiField =
  | "favoriteGenres"
  | "instruments"
  | "preferredLanguages"
  | "naturalElements";

type BooleanField =
  | "difficultySleeping"
  | "troubleRemembering"
  | "forgetsEverydayThings"
  | "difficultyRecallingOldMemories"
  | "memoryWorseThanYearAgo"
  | "visitedMentalHealthProfessional";

type TextField = "name" | "birthplaceCity" | "birthplaceCountry" | "favoriteMusician";
type SelectField = "sex" | "condition";

type Step =
  | {
      id: string;
      kind: "text";
      field: TextField;
      title: string;
      description: string;
      placeholder?: string;
      required?: boolean;
      optional?: boolean;
      errorMessage?: string;
    }
  | {
      id: string;
      kind: "date";
      field: "dateOfBirth";
      title: string;
      description: string;
      required?: boolean;
      optional?: boolean;
      errorMessage?: string;
    }
  | {
      id: string;
      kind: "select";
      field: SelectField;
      title: string;
      description: string;
      options: Array<{ label: string; value: string }>;
      required?: boolean;
      optional?: boolean;
      errorMessage?: string;
    }
  | {
      id: string;
      kind: "multi";
      field: MultiField;
      title: string;
      description: string;
      options: string[];
      required?: boolean;
      optional?: boolean;
      errorMessage?: string;
    }
  | {
      id: string;
      kind: "boolean";
      field: BooleanField;
      title: string;
      description: string;
    }
  | {
      id: string;
      kind: "range";
      index: number;
      title: string;
      description: string;
    };

const BASE_STEPS: Step[] = [
  {
    id: "name",
    kind: "text",
    field: "name",
    title: "Full name",
    description: "Share the name you would like on your session notes.",
    placeholder: "e.g. Amara Sol",
    required: true,
    errorMessage: "Please provide a name to continue.",
  },
  {
    id: "sex",
    kind: "select",
    field: "sex",
    title: "How do you identify?",
    description: "This helps tailor tone and pacing in the recommendations.",
    options: [
      { label: "Female", value: "Female" },
      { label: "Male", value: "Male" },
      { label: "Other", value: "Other" },
    ],
    required: true,
  },
  {
    id: "dateOfBirth",
    kind: "date",
    field: "dateOfBirth",
    title: "Date of birth",
    description: "So we can shape the experience with age-appropriate pacing.",
    required: true,
    errorMessage: "Please select a date of birth to continue.",
  },
  {
    id: "birthplaceCity",
    kind: "text",
    field: "birthplaceCity",
    title: "Birthplace city",
    description: "Optional context for regional musical cues.",
    placeholder: "e.g. Dhaka",
    optional: true,
  },
  {
    id: "birthplaceCountry",
    kind: "text",
    field: "birthplaceCountry",
    title: "Birthplace country",
    description: "Helps reflect cultural textures in the soundscape.",
    placeholder: "e.g. Bangladesh",
    required: true,
    errorMessage: "Please provide a birthplace country.",
  },
  {
    id: "condition",
    kind: "select",
    field: "condition",
    title: "Primary condition",
    description: "Choose the primary focus for this therapy session.",
    options: [
      { label: "Dementia / Alzheimer's", value: "dementia" },
      { label: "Down Syndrome", value: "down_syndrome" },
      { label: "ADHD", value: "adhd" },
    ],
    required: true,
  },
  {
    id: "favoriteMusician",
    kind: "text",
    field: "favoriteMusician",
    title: "Favorite musician or artist",
    description: "Optional. Share anyone who feels grounding or inspiring.",
    placeholder: "e.g. Miles Davis",
    optional: true,
  },
  {
    id: "favoriteGenres",
    kind: "multi",
    field: "favoriteGenres",
    title: "Favorite genres",
    description: "Select all that resonate with you.",
    options: GENRES,
    required: true,
    errorMessage: "Please select at least one genre.",
  },
  {
    id: "instruments",
    kind: "multi",
    field: "instruments",
    title: "Preferred instruments",
    description: "Optional. Choose any instruments you enjoy.",
    options: INSTRUMENTS,
    optional: true,
  },
  {
    id: "preferredLanguages",
    kind: "multi",
    field: "preferredLanguages",
    title: "Preferred languages",
    description: "Optional. Helpful for vocal or lyric-based tracks.",
    options: LANGUAGES,
    optional: true,
  },
  {
    id: "naturalElements",
    kind: "multi",
    field: "naturalElements",
    title: "Natural elements you connect with",
    description: "Optional. These guide ambient textures.",
    options: NATURAL_ELEMENTS,
    optional: true,
  },
  {
    id: "difficultySleeping",
    kind: "boolean",
    field: "difficultySleeping",
    title: "Difficulty sleeping",
    description: "Have you experienced difficulty sleeping recently?",
  },
  {
    id: "troubleRemembering",
    kind: "boolean",
    field: "troubleRemembering",
    title: "Trouble remembering recent events",
    description: "Have you noticed issues recalling recent events?",
  },
  {
    id: "forgetsEverydayThings",
    kind: "boolean",
    field: "forgetsEverydayThings",
    title: "Forgets everyday tasks",
    description: "Do everyday tasks feel harder to remember?",
  },
  {
    id: "difficultyRecallingOldMemories",
    kind: "boolean",
    field: "difficultyRecallingOldMemories",
    title: "Difficulty recalling older memories",
    description: "Do older memories feel more distant lately?",
  },
  {
    id: "memoryWorseThanYearAgo",
    kind: "boolean",
    field: "memoryWorseThanYearAgo",
    title: "Memory worse than a year ago",
    description: "Has memory worsened compared to last year?",
  },
  {
    id: "visitedMentalHealthProfessional",
    kind: "boolean",
    field: "visitedMentalHealthProfessional",
    title: "Visited a mental health professional",
    description: "Have you met with a mental health professional?",
  },
];

const BIG_FIVE_STEPS: Step[] = BIG_FIVE_STATEMENTS.map(
  (statement, index) => ({
    id: `big-five-${index + 1}`,
    kind: "range",
    index,
    title: `Big Five reflection ${index + 1} of ${BIG_FIVE_STATEMENTS.length}`,
    description: statement,
  })
);

const STEPS = [...BASE_STEPS, ...BIG_FIVE_STEPS];

const getStepError = (step: Step, data: IntakeFormValues) => {
  if (!("required" in step) || !step.required) {
    return null;
  }

  if (step.kind === "text" || step.kind === "date") {
    const value = String(data[step.field] ?? "").trim();
    return value ? null : step.errorMessage || "Please provide a response.";
  }

  if (step.kind === "multi") {
    return data[step.field].length > 0
      ? null
      : step.errorMessage || "Please select at least one option.";
  }

  if (step.kind === "select") {
    return data[step.field] ? null : step.errorMessage || "Choose an option.";
  }

  return null;
};

export default function MusicAppPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IntakeFormValues>(INITIAL_FORM);
  const [showValidation, setShowValidation] = useState(false);
  const [dismissedSessionId, setDismissedSessionId] = useState<string | null>(
    null
  );

  const {
    submitIntake,
    loading,
    apiError,
    recommendations,
    patientSummary,
    bigFive,
  } = useRecommendations();

  const { handleFeedback, feedbackLoadingId } = useFeedback({
    recommendations,
    patientSummary,
  });

  const sessionId =
    patientSummary?.session_id || patientSummary?.sessionId || null;
  const shouldShowResults =
    Boolean(recommendations && patientSummary && bigFive && sessionId) &&
    dismissedSessionId !== sessionId;

  const step = STEPS[currentStep];
  const totalSteps = STEPS.length;
  const progress = useMemo(
    () => Math.round(((currentStep + 1) / totalSteps) * 100),
    [currentStep, totalSteps]
  );
  const stepError = getStepError(step, formData);
  const isFinalStep = currentStep === totalSteps - 1;

  const handleBack = () => {
    setShowValidation(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (stepError) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);

    if (isFinalStep) {
      submitIntake(formData);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const updateTextField = (field: TextField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateDateField = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: value,
    }));
  };

  const updateSelectField = (field: SelectField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as IntakeFormValues[SelectField],
    }));
  };

  const toggleMultiOption = (field: MultiField, option: string) => {
    setFormData((prev) => {
      const selection = new Set(prev[field]);
      if (selection.has(option)) {
        selection.delete(option);
      } else {
        selection.add(option);
      }
      return {
        ...prev,
        [field]: Array.from(selection),
      };
    });
  };

  const updateBooleanField = (field: BooleanField, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBigFive = (index: number, value: number) => {
    setFormData((prev) => {
      const next = [...prev.bigFiveResponses];
      next[index] = value;
      return {
        ...prev,
        bigFiveResponses: next,
      };
    });
  };

  const renderStepInput = () => {
    if (step.kind === "text") {
      return (
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
            Your response
          </label>
          <input
            type="text"
            value={formData[step.field]}
            onChange={(event) => updateTextField(step.field, event.target.value)}
            placeholder={step.placeholder}
            className="w-full rounded-2xl border border-[#D8C6B6] bg-white px-4 py-3 text-sm text-[var(--charcoal)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6F55]"
          />
        </div>
      );
    }

    if (step.kind === "date") {
      return (
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
            Select a date
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(event) => updateDateField(event.target.value)}
            className="w-full rounded-2xl border border-[#D8C6B6] bg-white px-4 py-3 text-sm text-[var(--charcoal)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6F55]"
          />
        </div>
      );
    }

    if (step.kind === "select") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {step.options.map((option) => {
            const isSelected = formData[step.field] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateSelectField(step.field, option.value)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold shadow-sm transition ${
                  isSelected
                    ? "border-[#8A6F55] bg-white text-[var(--charcoal)]"
                    : "border-[#E6DED4] bg-white/70 text-[var(--graphite)]"
                }`}
                aria-pressed={isSelected}
              >
                {option.label}
                {isSelected && <Check className="h-4 w-4 text-[#8A6F55]" />}
              </button>
            );
          })}
        </div>
      );
    }

    if (step.kind === "multi") {
      const selected = formData[step.field];
      return (
        <div className="space-y-4">
          <p className="text-sm text-[var(--graphite)]">
            {selected.length} selected
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {step.options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMultiOption(step.field, option)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold shadow-sm transition ${
                    isSelected
                      ? "border-[#8A6F55] bg-white text-[var(--charcoal)]"
                      : "border-[#E6DED4] bg-white/70 text-[var(--graphite)]"
                  }`}
                  aria-pressed={isSelected}
                >
                  {option}
                  {isSelected && <Check className="h-4 w-4 text-[#8A6F55]" />}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (step.kind === "boolean") {
      const value = formData[step.field];
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ].map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => updateBooleanField(step.field, option.value)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold shadow-sm transition ${
                  isSelected
                    ? "border-[#8A6F55] bg-white text-[var(--charcoal)]"
                    : "border-[#E6DED4] bg-white/70 text-[var(--graphite)]"
                }`}
                aria-pressed={isSelected}
              >
                {option.label}
                {isSelected && <Check className="h-4 w-4 text-[#8A6F55]" />}
              </button>
            );
          })}
        </div>
      );
    }

    if (step.kind === "range") {
      const value = formData.bigFiveResponses[step.index];
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm text-[var(--graphite)]">
            <span>Strongly disagree</span>
            <span className="rounded-full bg-[#E6DED4] px-3 py-1 text-xs font-semibold text-[var(--charcoal)]">
              {value} / 7
            </span>
            <span>Strongly agree</span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            value={value}
            onChange={(event) =>
              updateBigFive(step.index, Number(event.target.value))
            }
            className="h-2 w-full cursor-pointer accent-[#8A6F55]"
          />
          <div className="flex justify-between text-xs text-[var(--ash)]">
            <span>1</span>
            <span>4</span>
            <span>7</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`${inter.className} ${playfair.variable} min-h-screen bg-[var(--canvas)] text-[var(--charcoal)]`}
      style={colorVars}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F4F1EC] via-[#EFE9E2] to-[#E6DED4]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(198,169,138,0.25)_0%,rgba(244,241,236,0.7)_55%,rgba(244,241,236,1)_100%)]" />

        <main className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ash)]">
              TheramuseRX intake
            </p>
            <h1 className="font-[var(--font-playfair)] text-3xl text-[var(--charcoal)] md:text-4xl">
              A gentle, one-at-a-time journey
            </h1>
            <p className="max-w-2xl text-sm text-[var(--graphite)] md:text-base">
              Each response shapes your personalized recommendations. Move at
              your own pace.
            </p>
          </div>

          <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ash)]">
                  Question {currentStep + 1} of {totalSteps}
                </p>
                <h2 className="font-[var(--font-playfair)] text-2xl text-[var(--charcoal)] md:text-3xl">
                  {step.title}
                </h2>
                <p className="text-sm text-[var(--graphite)]">
                  {step.description}
                </p>
                {"optional" in step && step.optional && (
                  <span className="inline-flex items-center rounded-full border border-[#E6DED4] bg-[#F8F4EF] px-3 py-1 text-xs font-semibold text-[var(--ash)]">
                    Optional
                  </span>
                )}
              </div>
              <div className="min-w-[200px] space-y-2 text-right">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
                  Progress
                </span>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full bg-[#8A6F55] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--graphite)]">
                  {totalSteps - currentStep} steps to go
                </p>
              </div>
            </div>

            <div className="mt-8">{renderStepInput()}</div>

            {showValidation && stepError && (
              <div className="mt-6 rounded-2xl border border-[#D8C6B6] bg-[#F8F4EF] px-4 py-3 text-sm text-[#8A6F55]">
                {stepError}
              </div>
            )}

            {apiError && (
              <div className="mt-4 rounded-2xl border border-[#D8C6B6] bg-[#F8F4EF] px-4 py-3 text-sm text-[#8A6F55]">
                {apiError}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
                className="inline-flex items-center gap-2 rounded-full border border-[#E6DED4] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--graphite)] shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-[#8A6F55] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading && isFinalStep ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {isFinalStep ? "Get Recommendations" : "Next"}
              </button>
            </div>
          </section>
        </main>
      </div>

      <RecommendationModal
        isOpen={shouldShowResults}
        onClose={() => setDismissedSessionId(sessionId)}
      >
        <div
          className={`${inter.className} ${playfair.variable} text-[var(--charcoal)]`}
          style={colorVars}
        >
          <RecommendationResults
            recommendations={recommendations}
            patientSummary={patientSummary}
            bigFive={bigFive}
            onFeedback={handleFeedback}
            feedbackLoadingId={feedbackLoadingId}
          />
        </div>
      </RecommendationModal>
    </div>
  );
}
