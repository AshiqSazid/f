"use client";
import React from "react";
import Header from "@/components/common/header";
import {
  adhdResearch,
  applicationInsights,
  dementiaResearch,
  detailedCompilation,
  downSyndromeResearch,
  personalityResearch,
  referenceLinks,
  ResearchCategory,
  researchSections,
} from "@/lib/researchEvidence";
import DetailsCard from "@/components/research/DetailsCard";
import CategoryCard from "@/components/research/CategoryCard";
import { Link } from "lucide-react";

const ResearchEvidence = () => {
  const categories: ResearchCategory[] = [
    dementiaResearch,
    adhdResearch,
    downSyndromeResearch,
    personalityResearch,
  ];

  return (
    <div className="min-h-screen max-w-6xl mx-auto space-y-6 bg-linear-to-br from-slate-50 to-blue-50/30 py-8 px-1.5 lg:px-0">
      {/* Header Section */}
      <Header
        title={"Research Evidence"}
        description={
          "Comprehensive scientific evidence supporting music therapy for dementia, ADHD, Down Syndrome, and personality-aligned playlist design."
        }
      />
      <div className="space-y-4">
        {researchSections.map((section) => (
          <article
            key={section.title}
            className="p-3 lg:p-6 bg-white rounded-lg border border-gray-100"
          >
            <h2 className="text-sm lg:text-xl font-semibold text-gray-800">
              {section.title}
            </h2>
            <p className="mt-2 text-xs lg:text-sm text-gray-600">
              {section.summary}
            </p>
            <ul className="mt-4 space-y-2 text-xs lg:text-sm text-gray-700">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span
                    className="mt-1 inline-block h-2 w-2 rounded-full bg-[#338aff]"
                    aria-hidden
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <DetailsCard
        title={detailedCompilation.title}
        description="Deep-dive summaries covering study design, key findings, and implementation guidance."
        sections={detailedCompilation.sections}
      />

      {categories.map((category) => (
        <CategoryCard key={category.heading} category={category} />
      ))}

      <section className="p-3 lg:p-6 bg-white rounded-lg border border-gray-100">
        <h2 className="text-sm lg:text-xl font-semibold text-gray-800">
          Integrated Practice Guidance
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {applicationInsights.map((block) => (
            <div
              key={block.title}
              className="rounded-lg border border-gray-200 bg-gray-50 p-2 lg:p-4"
            >
              <h3 className="text-sm lg:text-lg font-semibold text-gray-800">
                {block.title}
              </h3>
              <ul className="mt-3 space-y-2 text-xs lg:text-sm text-gray-700">
                {block.bullets.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span
                      className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-teal"
                      aria-hidden
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        className="p-6 bg-white rounded-lg border border-gray-100"
        aria-labelledby="research-summary"
      >
        <h2
          id="research-summary"
          className="text-xl font-semibold text-gray-800"
        >
          Research Summary
        </h2>
        <p className="mt-3 text-sm text-gray-700">
          The evidence base, spanning systematic reviews, RCTs, longitudinal
          studies, and large-scale observational analyses, demonstrates
          consistent benefits of personalised music interventions across
          dementia, ADHD, and Down Syndrome populations. Integrating Big Five
          personality insights further increases adherence and therapeutic
          impact. By combining nostalgia-informed selection, active
          participation, and reinforcement learning, TheramuseRX RX delivers
          clinically aligned music therapy while capturing actionable feedback
          metrics.
        </p>
      </section>

      <section className="p-6 bg-white rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Reference Library
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Source material for clinicians and researchers exploring music
          therapy, sensory entrainment, and personality aligned playlists.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {referenceLinks.map((ref) => (
            <a
              key={ref.url}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm font-medium text-[#338aff] hover:text-[#1e6fff]"
            >
              <Link className="mt-1 h-4 w-4" />
              <span>{ref.label}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResearchEvidence;
