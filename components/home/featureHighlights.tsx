"use client";
import React from "react";
import HighlightCard from "../common/highlightCard";
import { Brain, Moon, Smile } from "lucide-react";

const FeatureHighlights = () => {
  return (
    <div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <HighlightCard
        icon={<Brain className="h-8 w-8 text-white" />}
        title="Cognitive Uplift"
        description="Cross-validates nostalgia windows, therapeutic ragas, and patient context for dementia care."
      />
      <HighlightCard
        icon={<Moon className="h-8 w-8 text-white" />}
        title="Sleep & Calmness"
        description="Delivers circadian-aware playlists that blend binaural beats, ambient focus, and sensory cues."
      />
      <HighlightCard
        icon={<Smile className="h-8 w-8 text-white" />}
        title="Emotional Resilience"
        description="Aligns Big Five personality scores with musical motifs to stabilise mood and motivation."
      />
    </div>
  );
};

export default FeatureHighlights;
