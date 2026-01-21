"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display, Inter } from "next/font/google";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Loader2,
  Menu,
  Music4,
  Pause,
  Play,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";

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

type PageId = "landing" | "wellness-room" | "music-app";

type Question = {
  id: string;
  prompt: string;
  options?: string[];
  optional?: boolean;
  input?: "text";
  helper?: string;
};

type GeneratedMusic = {
  title: string;
  description: string;
  duration: string;
  mood: string[];
  instruments: string[];
  waveformData: number[];
};

const NAV_LINKS = [
  { label: "Explore", target: "hero" },
  { label: "Experiences", target: "experiences" },
  { label: "Journal", target: "divider" },
  { label: "About", target: "philosophy" },
  { label: "Contact", target: "newsletter" },
];

const EXPERIENCE_CARDS = [
  {
    title: "Guided Reflection",
    description:
      "AI-led soundscapes that help you unpack emotions and thoughts at your own pace.",
  },
  {
    title: "Emotional Regulation",
    description:
      "Grounding music and adaptive compositions designed to help you feel steadier.",
  },
  {
    title: "Creative Processing",
    description:
      "Express yourself through personalized musical experiences when words feel hard.",
  },
];

const QUESTIONS: Question[] = [
  {
    id: "feeling",
    prompt: "How are you feeling right now?",
    options: [
      "Calm",
      "Anxious",
      "Sad",
      "Joyful",
      "Tired",
      "Energized",
      "Overwhelmed",
    ],
  },
  {
    id: "need",
    prompt: "What do you need from this session?",
    options: ["Comfort", "Energy", "Grounding", "Clarity", "Release", "Peace"],
  },
  {
    id: "pace",
    prompt: "What pace feels right?",
    options: ["Slow & Gentle", "Moderate", "Dynamic", "Let the music decide"],
  },
  {
    id: "sounds",
    prompt: "What sounds call to you?",
    options: [
      "Piano",
      "Strings",
      "Nature Sounds",
      "Ambient Synthesis",
      "Guitar",
      "Percussion",
    ],
  },
  {
    id: "duration",
    prompt: "How long would you like to listen?",
    options: ["5 minutes", "10 minutes", "15 minutes", "Keep playing"],
    optional: true,
  },
  {
    id: "intention",
    prompt: "Any specific intention?",
    optional: true,
    input: "text",
    helper: "Share a word or short phrase, or skip if you prefer.",
  },
];

const TIME_METAPHORS = [
  "at Dawn",
  "at Dusk",
  "under Soft Light",
  "beneath Stars",
  "in Stillness",
  "in Motion",
];

const MOOD_ADJECTIVES: Record<string, string> = {
  Calm: "Quiet",
  Anxious: "Steady",
  Sad: "Tender",
  Joyful: "Bright",
  Tired: "Resting",
  Energized: "Energizing",
  Overwhelmed: "Soft",
};

const NEED_DESCRIPTORS: Record<string, string> = {
  Comfort: "comfort",
  Energy: "energy",
  Grounding: "grounding",
  Clarity: "clarity",
  Release: "release",
  Peace: "peace",
};

const DURATION_MAP: Record<string, string> = {
  "5 minutes": "05:00",
  "10 minutes": "10:00",
  "15 minutes": "15:00",
  "Keep playing": "Continuous",
};

const REFLECTION_PROMPTS = [
  "Notice where the sound lands in your body.",
  "Breathe slowly and let the rhythm meet your pace.",
  "Allow one thought to drift away with each phrase.",
  "What emotion feels softened by this moment?",
  "Let the music hold whatever is difficult today.",
];

const CHECK_IN_OPTIONS = [
  "Lighter",
  "Steadier",
  "More Open",
  "Still Processing",
  "Ready to Rest",
];

const HERO_WAVEFORM = [20, 40, 28, 56, 36, 62, 32, 54, 26, 44, 24, 48];
const PHILOSOPHY_BARS = [18, 40, 26, 60, 34, 52, 28, 58, 30, 46, 22];

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

const buildGeneratedMusic = (answers: Record<string, string>): GeneratedMusic => {
  const feeling = answers.feeling ?? "Calm";
  const need = answers.need ?? "Peace";
  const pace = answers.pace ?? "Slow & Gentle";
  const sounds = answers.sounds ?? "Piano";
  const durationAnswer = answers.duration ?? "10 minutes";
  const intention = answers.intention ?? "";

  const moodWord = MOOD_ADJECTIVES[feeling] ?? feeling;
  const instrumentWord = sounds.replace("Sounds", "").trim();
  const timeMetaphor =
    TIME_METAPHORS[Math.floor(Math.random() * TIME_METAPHORS.length)];
  const title = `${moodWord} ${instrumentWord} ${timeMetaphor}`;
  const paceDescription =
    pace === "Let the music decide" ? "adaptive" : pace.toLowerCase();
  const needDescription = NEED_DESCRIPTORS[need] ?? need.toLowerCase();

  const description = [
    `A ${paceDescription} pace with ${sounds.toLowerCase()} textures to support ${needDescription}.`,
    intention
      ? `Your intention, ${intention}, guided the flow with soft emphasis.`
      : "Let the composition meet you gently with room to breathe.",
  ].join(" ");

  return {
    title,
    description,
    duration: DURATION_MAP[durationAnswer] ?? "10:00",
    mood: [feeling.toLowerCase(), need.toLowerCase()],
    instruments: [instrumentWord.toLowerCase()],
    waveformData: Array.from({ length: 56 }, () =>
      Math.floor(Math.random() * 70) + 20,
    ),
  };
};

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<PageId>("landing");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [generatedMusic, setGeneratedMusic] = useState<GeneratedMusic | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [breathingEnabled, setBreathingEnabled] = useState(true);
  const [reflectionEnabled, setReflectionEnabled] = useState(true);
  const [reflectionPrompt, setReflectionPrompt] = useState(
    REFLECTION_PROMPTS[0],
  );
  const [sessionCheckIn, setSessionCheckIn] = useState<string | null>(null);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [readyChecked, setReadyChecked] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const generationTimeoutRef = useRef<number | null>(null);
  const reflectionIntervalRef = useRef<number | null>(null);
  const promptIndexRef = useRef(0);

  const currentQuestion = QUESTIONS[questionIndex];

  const progressValue = useMemo(() => {
    const baseStep = isGenerating || generatedMusic ? QUESTIONS.length : 0;
    const progressStep =
      baseStep || Math.min(questionIndex + 1, QUESTIONS.length);
    return (progressStep / QUESTIONS.length) * 100;
  }, [questionIndex, isGenerating, generatedMusic]);

  const progressLabel = useMemo(() => {
    if (isGenerating || generatedMusic) {
      return `Question ${QUESTIONS.length} of ${QUESTIONS.length}`;
    }
    return `Question ${questionIndex + 1} of ${QUESTIONS.length}`;
  }, [questionIndex, isGenerating, generatedMusic]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      if (generationTimeoutRef.current) {
        window.clearTimeout(generationTimeoutRef.current);
      }
      if (reflectionIntervalRef.current) {
        window.clearInterval(reflectionIntervalRef.current);
      }
    };
  }, []);

  const navigate = (nextPage: PageId) => {
    if (nextPage === currentPage) {
      return;
    }

    if (currentPage === "music-app" && nextPage !== "music-app") {
      stopReflectionCycle();
      setIsPlaying(false);
    }

    setIsTransitioning(true);
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      setCurrentPage(nextPage);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 250);
  };

  const navigateToMusicApp = () => {
    setIsTransitioning(true);
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = window.setTimeout(() => {
      router.push("/music-app");
    }, 250);
  };

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const stopReflectionCycle = () => {
    if (reflectionIntervalRef.current) {
      window.clearInterval(reflectionIntervalRef.current);
      reflectionIntervalRef.current = null;
    }
  };

  const startReflectionCycle = () => {
    stopReflectionCycle();
    promptIndexRef.current = 0;
    setReflectionPrompt(REFLECTION_PROMPTS[0]);

    reflectionIntervalRef.current = window.setInterval(() => {
      promptIndexRef.current =
        (promptIndexRef.current + 1) % REFLECTION_PROMPTS.length;
      setReflectionPrompt(REFLECTION_PROMPTS[promptIndexRef.current]);
    }, 7000);
  };

  const resetMusicSession = () => {
    stopReflectionCycle();
    setQuestionIndex(0);
    setUserAnswers({});
    setGeneratedMusic(null);
    setIsGenerating(false);
    setIsPlaying(false);
    setSessionCheckIn(null);
    setReflectionPrompt(REFLECTION_PROMPTS[0]);
  };

  const startGeneration = (answers: Record<string, string>) => {
    stopReflectionCycle();
    setIsGenerating(true);
    setGeneratedMusic(null);
    setIsPlaying(false);
    setSessionCheckIn(null);
    const nextMusic = buildGeneratedMusic(answers);

    if (generationTimeoutRef.current) {
      window.clearTimeout(generationTimeoutRef.current);
    }

    generationTimeoutRef.current = window.setTimeout(() => {
      setGeneratedMusic(nextMusic);
      setIsGenerating(false);
    }, 1800);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next && reflectionEnabled) {
        startReflectionCycle();
      } else {
        stopReflectionCycle();
      }
      return next;
    });
  };

  const handleToggleReflection = () => {
    setReflectionEnabled((prev) => {
      const next = !prev;
      if (isPlaying) {
        if (next) {
          startReflectionCycle();
        } else {
          stopReflectionCycle();
        }
      }
      return next;
    });
  };

  const handleOptionSelect = (value: string) => {
    const updatedAnswers = { ...userAnswers, [currentQuestion.id]: value };
    setUserAnswers(updatedAnswers);
    if (questionIndex === QUESTIONS.length - 1) {
      startGeneration(updatedAnswers);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    const updatedAnswers = { ...userAnswers };
    delete updatedAnswers[currentQuestion.id];
    setUserAnswers(updatedAnswers);

    if (questionIndex === QUESTIONS.length - 1) {
      startGeneration(updatedAnswers);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleTextContinue = () => {
    const rawValue = userAnswers[currentQuestion.id] ?? "";
    const trimmed = rawValue.trim();
    const updatedAnswers = { ...userAnswers };

    if (trimmed) {
      updatedAnswers[currentQuestion.id] = trimmed;
    } else {
      delete updatedAnswers[currentQuestion.id];
    }

    setUserAnswers(updatedAnswers);

    if (questionIndex === QUESTIONS.length - 1) {
      startGeneration(updatedAnswers);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const landingPage = (
    <div
      className={`${inter.className} ${playfair.variable} bg-[var(--canvas)] text-[var(--charcoal)]`}
      style={colorVars}
    >
      <header className="sticky top-0 z-40 border-b border-[var(--blush)]/60 bg-[rgba(244,241,236,0.85)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="text-lg font-semibold tracking-wide text-[var(--charcoal)]"
          >
            TheramuseRX
          </button>
          <nav className="hidden items-center gap-6 text-sm text-[var(--graphite)] lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollToSection(link.target)}
                className="transition-colors hover:text-[var(--umber)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              className="text-sm font-semibold text-[var(--graphite)] transition-colors hover:text-[var(--umber)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
            >
              
            </button>
            <button
              type="button"
              onClick={() => navigate("wellness-room")}
              className="rounded-full bg-[var(--umber)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
            >
              Get Started
            </button>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-full border border-[var(--blush)]/70 bg-white/80 p-2 text-[var(--graphite)] shadow-sm transition hover:text-[var(--umber)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-[var(--blush)]/60 bg-[rgba(244,241,236,0.95)] px-6 py-4 lg:hidden">
            <div className="flex flex-col gap-3 text-sm text-[var(--graphite)]">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    scrollToSection(link.target);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left transition-colors hover:text-[var(--umber)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="flex-1 rounded-full border border-[var(--blush)]/80 px-4 py-2 text-sm font-semibold text-[var(--graphite)]"
                >
                  
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("wellness-room");
                  }}
                  className="flex-1 rounded-full bg-[var(--umber)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="hero" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4F1EC] via-[#EFE9E2] to-[#E6DED4]" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(198,169,138,0.35)_0%,rgba(244,241,236,0.7)_55%,rgba(244,241,236,1)_100%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-12 lg:pt-16">
            <div
              className="relative h-56 overflow-hidden rounded-[28px] border border-white/70 opacity-0 shadow-2xl motion-reduce:opacity-100 motion-reduce:transform-none motion-safe:animate-[fadeUp_0.9s_ease-out_forwards] md:h-72"
              style={{ animationDelay: "120ms" }}
            >
              <div className="absolute inset-0 bg-[url('/hero-section.jpg')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(31,28,26,0.3),rgba(244,241,236,0.1))]" />
              <div className="relative flex h-full items-end p-5">
                <div className="rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--umber)]">
                  TheramuseRX Wellness Room
                </div>
              </div>
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div
                className="space-y-6 opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none motion-safe:animate-[fadeUp_0.9s_ease-out_forwards]"
                style={{ animationDelay: "240ms" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ash)]">
                  AI-powered music therapy
                </p>
                <h1 className="font-[var(--font-playfair)] text-[clamp(2.75rem,4.5vw,3.5rem)] leading-[1.05] text-[var(--charcoal)]">
                  Where Healing Meets Expression
                </h1>
                <p className="max-w-xl text-base text-[var(--graphite)] md:text-lg">
                  AI-powered music therapy designed to help you reflect, regulate,
                  and reconnect with yourself, gently and privately.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("wellness-room")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--umber)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
                  >
                    Enter TheramuseRX Wellness Room
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("experiences")}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--blush)]/80 bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--graphite)] shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
                  >
                    How It Works
                  </button>
                </div>
                <div className="grid gap-4 pt-4 sm:grid-cols-3">
                  {[
                    {
                      title: "Private by design",
                      detail: "No accounts required to start",
                    },
                    {
                      title: "Guided by care",
                      detail: "Built with emotional safety",
                    },
                    {
                      title: "Personal every time",
                      detail: "Soundscapes tuned to you",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-[var(--charcoal)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--graphite)]">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none motion-safe:animate-[fadeUp_0.9s_ease-out_forwards]"
                style={{ animationDelay: "360ms" }}
              >
                <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--charcoal)]">
                      <Sparkles className="h-4 w-4 text-[var(--umber)]" />
                      Session preview
                    </div>
                    <span className="text-xs text-[var(--ash)]">Today</span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--graphite)]">
                    A calm, private place to meet your emotions with sound and
                    gentle pacing.
                  </p>
                  <div className="mt-6 flex h-24 items-end gap-1">
                    {HERO_WAVEFORM.map((value, index) => (
                      <span
                        key={`${value}-${index}`}
                        className="w-2 flex-1 rounded-full bg-[var(--clay)]/70"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl bg-[var(--linen)]/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
                      Focus
                    </p>
                    <p className="mt-2 text-sm text-[var(--graphite)]">
                      Gentle pacing + nature textures for grounding.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("wellness-room")}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--blush)]/70 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--graphite)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
                  >
                    Enter the room
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="experiences"
          className="relative mx-auto max-w-6xl px-6 py-16"
        >
          <div className="flex flex-col items-start gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ash)]">
              Signature experiences
            </p>
            <h2 className="font-[var(--font-playfair)] text-[clamp(2rem,3vw,2.25rem)] text-[var(--charcoal)]">
              Ways to Work With TheramuseRX
            </h2>
            <p className="max-w-2xl text-base text-[var(--graphite)]">
              Choose the type of support you need. Each journey is shaped by your
              answers and changes with you.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {EXPERIENCE_CARDS.map((card) => (
              <article
                key={card.title}
                className="group flex h-full flex-col rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--linen)] text-[var(--umber)]">
                  <Music4 className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-[var(--charcoal)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--graphite)]">
                  {card.description}
                </p>
                <button
                  type="button"
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[var(--umber)] transition-colors group-hover:text-[var(--charcoal)]"
                >
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="divider" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F1C1A] via-[#2A241F] to-[#3B3128]" />
          <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_100%_0%,rgba(198,169,138,0.25)_0%,rgba(31,28,26,0.95)_60%)]" />
          <div className="relative mx-auto flex max-w-5xl flex-col gap-4 px-6 py-16 text-[#F4F1EC]">
            <h3 className="font-[var(--font-playfair)] text-3xl">
              Support That Adapts to You
            </h3>
            <p className="max-w-2xl text-sm text-[var(--warm-gray)]">
              Built with care, privacy, and emotional safety at the core. Every
              note is shaped to meet you with respect and warmth.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection("philosophy")}
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--blush)]/50 bg-white/10 px-5 py-2 text-sm font-semibold text-[#F4F1EC] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1C1A]"
            >
              See How It Works
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section
          id="philosophy"
          className="mx-auto max-w-6xl px-6 py-16"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ash)]">
                Our philosophy
              </p>
              <h2 className="font-[var(--font-playfair)] text-[clamp(2rem,3vw,2.25rem)] text-[var(--charcoal)]">
                The Art of Being With Yourself
              </h2>
              <p className="text-base text-[var(--graphite)]">
                TheramuseRX is not about fixing you. It is about helping you listen
                - without judgment, pressure, or urgency. We believe healing
                happens when you feel safe, seen, and move at your own rhythm.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--blush)]/80 bg-white/80 px-5 py-2 text-sm font-semibold text-[var(--graphite)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
              >
                Read Our Approach
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="relative h-72 overflow-hidden rounded-3xl border border-white/70 bg-[radial-gradient(80%_80%_at_10%_10%,rgba(198,169,138,0.25)_0%,rgba(239,233,226,0.9)_70%)] shadow-xl md:h-96">
              <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(198,169,138,0.2)_0%,rgba(244,241,236,0.8)_50%,rgba(230,222,212,0.9)_100%)]" />
              <div className="relative flex h-full items-center justify-center">
                <div className="flex h-32 w-3/4 items-end gap-2">
                  {PHILOSOPHY_BARS.map((value, index) => (
                    <span
                      key={`${value}-${index}`}
                      className="w-2 flex-1 rounded-full bg-[var(--clay)]/70"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/70 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
                  Listening ritual
                </p>
                <p className="mt-2 text-sm text-[var(--graphite)]">
                  Spacious harmonies and slow breaths to help you settle.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="newsletter"
          className="mx-auto max-w-6xl px-6 pb-16 pt-6"
        >
          <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <h3 className="font-[var(--font-playfair)] text-2xl text-[var(--charcoal)]">
                  Join the TheramuseRX Circle
                </h3>
                <p className="text-sm text-[var(--graphite)]">
                  Monthly reflections, new therapeutic tools, and gentle
                  reminders.
                </p>
              </div>
              <form
                className="grid w-full max-w-2xl gap-3 sm:grid-cols-3"
                onSubmit={(event) => event.preventDefault()}
              >
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    className="rounded-2xl border border-[var(--blush)]/80 bg-white px-4 py-3 text-sm font-normal text-[var(--charcoal)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)]"
                    placeholder="Amara"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    className="rounded-2xl border border-[var(--blush)]/80 bg-white px-4 py-3 text-sm font-normal text-[var(--charcoal)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)]"
                    placeholder="Sol"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)] sm:col-span-2 md:col-span-1">
                  Email
                  <input
                    type="email"
                    name="email"
                    className="rounded-2xl border border-[var(--blush)]/80 bg-white px-4 py-3 text-sm font-normal text-[var(--charcoal)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)]"
                    placeholder="you@TheramuseRX.com"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-2xl bg-[var(--umber)] px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] sm:col-span-3 md:col-span-1"
                >
                  Join Gently
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1F1C1A]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 text-[#B8B2AC] md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F4F1EC]">
              Experiences
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Guided Reflection</li>
              <li>Emotional Regulation</li>
              <li>Creative Processing</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F4F1EC]">
              Resources
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Wellness Journal</li>
              <li>TheramuseRX Circle</li>
              <li>Research</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F4F1EC]">
              About
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Our Approach</li>
              <li>Privacy</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-[#B8B2AC]">
          (c) TheramuseRX - A quieter way to care for your mind
        </div>
      </footer>
    </div>
  );

  const wellnessRoomPage = (
    <div
      className={`${inter.className} ${playfair.variable} relative min-h-screen overflow-hidden bg-[var(--canvas)] text-[var(--charcoal)]`}
      style={colorVars}
    >
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_20%,rgba(198,169,138,0.3)_0%,rgba(244,241,236,1)_60%)]" />
      <div className="absolute -top-20 right-16 h-64 w-64 rounded-full bg-[var(--blush)]/40 blur-3xl motion-safe:animate-[pulse_12s_ease-in-out_infinite]" />
      <div className="absolute bottom-16 left-16 h-48 w-48 rounded-full bg-[var(--clay)]/30 blur-3xl motion-safe:animate-[pulse_10s_ease-in-out_infinite]" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <button
          type="button"
          onClick={() => navigate("landing")}
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--umber)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Landing
        </button>

        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[var(--clay)]/30 blur-2xl motion-safe:animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-[var(--blush)]/70 bg-white/60 shadow-2xl">
            <div className="h-24 w-24 rounded-full bg-white/90 shadow-lg motion-safe:animate-[pulse_6s_ease-in-out_infinite]" />
          </div>
        </div>

        <h1 className="mt-10 font-[var(--font-playfair)] text-4xl text-[var(--charcoal)] md:text-5xl">
          Welcome to Your Wellness Room
        </h1>
        <p className="mt-4 max-w-xl text-base text-[var(--graphite)] md:text-lg">
          A private space designed just for you. Take a moment to settle in.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={navigateToMusicApp}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--umber)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
          >
            Begin Your Journey
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate("landing")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--blush)]/80 bg-white/80 px-6 py-3 text-sm font-semibold text-[var(--graphite)] shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
          >
            Return Home
          </button>
        </div>

        <div className="mt-10 grid w-full max-w-2xl gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
              Ambient Sound
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-[var(--graphite)]">
                {ambientEnabled ? "On" : "Off"}
              </span>
              <button
                type="button"
                onClick={() => setAmbientEnabled((prev) => !prev)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] ${
                  ambientEnabled
                    ? "bg-[var(--umber)] text-white"
                    : "bg-[var(--linen)] text-[var(--graphite)]"
                }`}
                aria-pressed={ambientEnabled}
              >
                {ambientEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
          <label className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
            <input
              type="checkbox"
              checked={readyChecked}
              onChange={(event) => setReadyChecked(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[var(--blush)] text-[var(--umber)] focus-visible:ring-2 focus-visible:ring-[var(--umber)]"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
                Mindful pacing
              </p>
              <p className="mt-2 text-sm text-[var(--graphite)]">
                I am ready to begin and will move gently.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="absolute left-10 top-24 h-3 w-3 rounded-full bg-[var(--clay)]/50 motion-safe:animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute right-16 top-1/3 h-2 w-2 rounded-full bg-[var(--umber)]/40 motion-safe:animate-[pulse_7s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 left-1/3 h-2.5 w-2.5 rounded-full bg-[var(--blush)]/60 motion-safe:animate-[pulse_5s_ease-in-out_infinite]" />
    </div>
  );

  const musicAppPage = (
    <div
      className={`${inter.className} ${playfair.variable} min-h-screen bg-[var(--canvas)] text-[var(--charcoal)]`}
      style={colorVars}
    >
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ash)]">
              TheramuseRX session
            </p>
            <h1 className="font-[var(--font-playfair)] text-3xl text-[var(--charcoal)] md:text-4xl">
              Personalized Soundscape
            </h1>
            <p className="text-sm text-[var(--graphite)]">
              Answer a few prompts to shape your music and care for your mood.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("wellness-room")}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--blush)]/80 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--graphite)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
            >
              Back to Wellness Room
            </button>
            <button
              type="button"
              onClick={() => navigate("landing")}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--umber)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
            >
              Back to Landing
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-white/80 bg-[var(--linen)]/80 p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--graphite)]">
                {progressLabel}
              </p>
              <p className="text-xs text-[var(--ash)]">
                Your answers stay private in this session.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--ash)]">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-[var(--umber)]" />
                Gentle flow
              </span>
              <span className="h-1 w-1 rounded-full bg-[var(--clay)]" />
              <span>{QUESTIONS.length} prompts</span>
            </div>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-[var(--umber)] transition-all duration-500 ease-out"
              style={{ width: `${progressValue}%` }}
            />
          </div>

          <div className="mt-8">
            {!isGenerating && !generatedMusic && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ash)]">
                    {currentQuestion.optional ? "Optional prompt" : "Reflective prompt"}
                  </p>
                  <h2 className="font-[var(--font-playfair)] text-2xl text-[var(--charcoal)] md:text-3xl">
                    {currentQuestion.prompt}
                  </h2>
                  {currentQuestion.helper && (
                    <p className="text-sm text-[var(--graphite)]">
                      {currentQuestion.helper}
                    </p>
                  )}
                </div>

                {currentQuestion.options && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {currentQuestion.options.map((option) => {
                      const isSelected =
                        userAnswers[currentQuestion.id] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleOptionSelect(option)}
                          className={`flex min-h-[52px] items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-semibold shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] ${
                            isSelected
                              ? "border-[var(--umber)] bg-white text-[var(--charcoal)]"
                              : "border-white/80 bg-white/70 text-[var(--graphite)]"
                          }`}
                          aria-pressed={isSelected}
                        >
                          <span>{option}</span>
                          <ArrowRight className="h-4 w-4 text-[var(--clay)]" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.input === "text" && (
                  <div className="space-y-4">
                    <textarea
                      value={userAnswers[currentQuestion.id] ?? ""}
                      onChange={(event) =>
                        setUserAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.id]: event.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-[var(--blush)]/80 bg-white px-4 py-3 text-sm text-[var(--charcoal)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)]"
                      placeholder="For example: let go of stress, soften my thoughts..."
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={questionIndex === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--blush)]/80 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--graphite)] shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <div className="flex items-center gap-3">
                    {currentQuestion.optional && (
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="rounded-full border border-[var(--blush)]/70 px-4 py-2 text-sm font-semibold text-[var(--graphite)] transition hover:text-[var(--charcoal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)]"
                      >
                        Skip
                      </button>
                    )}
                    {currentQuestion.input === "text" && (
                      <button
                        type="button"
                        onClick={handleTextContinue}
                        className="rounded-full bg-[var(--umber)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="flex items-center gap-3 text-lg font-semibold text-[var(--charcoal)]">
                  <Loader2 className="h-5 w-5 motion-safe:animate-spin" />
                  Creating your soundscape...
                </div>
                <p className="mt-3 text-sm text-[var(--graphite)]">
                  Listening to your answers and shaping the flow.
                </p>
                <div className="mt-10 flex h-20 items-end gap-2">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <span
                      key={`loading-${index}`}
                      className="w-2 rounded-full bg-[var(--clay)]/60 motion-safe:animate-[pulse_2.4s_ease-in-out_infinite]"
                      style={{
                        height: `${30 + index * 3}%`,
                        animationDelay: `${index * 120}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {generatedMusic && !isGenerating && (
              <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ash)]">
                        Your Personal Soundscape
                      </p>
                      <h2 className="font-[var(--font-playfair)] text-3xl text-[var(--charcoal)] md:text-4xl">
                        {generatedMusic.title}
                      </h2>
                      <p className="text-sm text-[var(--graphite)]">
                        {generatedMusic.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        stopReflectionCycle();
                        setIsPlaying(false);
                        setReflectionPrompt(REFLECTION_PROMPTS[0]);
                        setGeneratedMusic(null);
                        setQuestionIndex(QUESTIONS.length - 1);
                      }}
                      className="rounded-full border border-[var(--blush)]/80 bg-white px-4 py-2 text-sm font-semibold text-[var(--graphite)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
                    >
                      Edit Answers
                    </button>
                  </div>

                  <div className="mt-6 flex h-28 items-end gap-1">
                    {generatedMusic.waveformData.map((value, index) => (
                      <span
                        key={`wave-${index}`}
                        className={`w-2 flex-1 rounded-full bg-[var(--clay)]/70 ${
                          isPlaying ? "motion-safe:animate-pulse" : ""
                        }`}
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--umber)] text-white shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--umber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]"
                        aria-label={isPlaying ? "Pause playback" : "Play soundscape"}
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </button>
                      <div>
                        <p className="text-sm font-semibold text-[var(--graphite)]">
                          {isPlaying ? "Playing now" : "Paused"}
                        </p>
                        <p className="text-xs text-[var(--ash)]">
                          Duration {generatedMusic.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-4 w-4 text-[var(--umber)]" />
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={(event) =>
                          setVolume(Number(event.target.value))
                        }
                        className="h-2 w-32 cursor-pointer accent-[var(--umber)]"
                        aria-label="Volume"
                      />
                      <span className="text-xs text-[var(--ash)]">
                        {volume}%
                      </span>
                    </div>
                  </div>

                  {breathingEnabled && isPlaying && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="h-40 w-40 rounded-full border border-[var(--clay)]/50 motion-safe:animate-[pulse_6s_ease-in-out_infinite]" />
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
                      Mood and texture
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--graphite)]">
                      {generatedMusic.mood.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-[var(--linen)] px-3 py-1"
                        >
                          {item}
                        </span>
                      ))}
                      {generatedMusic.instruments.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-[var(--sand)] px-3 py-1"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
                      Reflection prompt
                    </p>
                    <p className="mt-4 text-sm text-[var(--graphite)]">
                      {isPlaying && reflectionEnabled
                        ? reflectionPrompt
                        : "Press play to begin a gentle reflection."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ash)]">
                      Listening aids
                    </p>
                    <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--graphite)]">
                      <button
                        type="button"
                        onClick={() => setBreathingEnabled((prev) => !prev)}
                        className="flex items-center justify-between rounded-full border border-[var(--blush)]/70 px-4 py-2 text-sm font-semibold text-[var(--graphite)]"
                        aria-pressed={breathingEnabled}
                      >
                        Breathing guide
                        <span className="text-xs text-[var(--ash)]">
                          {breathingEnabled ? "On" : "Off"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleReflection}
                        className="flex items-center justify-between rounded-full border border-[var(--blush)]/70 px-4 py-2 text-sm font-semibold text-[var(--graphite)]"
                        aria-pressed={reflectionEnabled}
                      >
                        Reflection prompts
                        <span className="text-xs text-[var(--ash)]">
                          {reflectionEnabled ? "On" : "Off"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/80 bg-[var(--linen)]/80 p-6 shadow-lg">
                  <p className="text-sm font-semibold text-[var(--graphite)]">
                    How do you feel now?
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {CHECK_IN_OPTIONS.map((option) => {
                      const isSelected = sessionCheckIn === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSessionCheckIn(option)}
                          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            isSelected
                              ? "border-[var(--umber)] bg-white text-[var(--charcoal)]"
                              : "border-[var(--blush)]/70 bg-white/70 text-[var(--graphite)]"
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4" />}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full border border-[var(--blush)]/80 bg-white px-5 py-2 text-sm font-semibold text-[var(--graphite)] transition hover:-translate-y-0.5"
                  >
                    Save to Library
                  </button>
                  <button
                    type="button"
                    onClick={resetMusicSession}
                    className="rounded-full bg-[var(--umber)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                  >
                    Create Another
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--blush)]/80 bg-white px-5 py-2 text-sm font-semibold text-[var(--graphite)] transition hover:-translate-y-0.5"
                  >
                    Share Feeling
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );

  const pageContent =
    currentPage === "landing"
      ? landingPage
      : currentPage === "wellness-room"
        ? wellnessRoomPage
        : musicAppPage;

  return (
    <div
      className={`transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      {pageContent}
    </div>
  );
}
