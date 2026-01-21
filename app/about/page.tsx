"use client";

import { Info, Target } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { features, pillars } from "@/lib/constant";
import FeatureCard from "@/components/about/featureCard";

export const dynamic = "force-dynamic";

const releaseDate = formatDate(new Date().toISOString());

export default function AboutPage() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto space-y-6 bg-linear-to-br from-slate-50 to-blue-50/30 py-8">
      {/* <div className="max-w-7xl mx-auto space-y-10"> */}
      {/* --- Header Section --- */}
      <section className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="p-3 lg:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-linear-to-br from-blue-600 to-teal-500 p-3 rounded-lg shadow-sm">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-0">
                <h1 className="text-xl lg:text-2xl font-serif tracking-tight font-bold text-gray-900">
                  About TheramuseRX
                </h1>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  v2.1.0
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                Last updated: {releaseDate}
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-justify leading-relaxed">
              <span className="font-semibold text-gray-900">TheramuseRX</span>{" "}
              is a research-driven music therapy assistant designed by
              clinicians and machine learning engineers to accelerate
              personalised interventions for dementia, Down Syndrome, and ADHD
              populations. The system ingests rich intake assessments, maps them
              to generational nostalgia cues, and curates long-form content from
              YouTube with rigorous filtering. Reinforcement learning closes the
              loop, ensuring every interaction refines the catalogue.
            </p>
          </div>
        </div>
      </section>

      {/* --- Pillars Section --- */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif tracking-tight font-bold text-gray-900 mb-2">
            Our Technology Framework
          </h2>
          {/* <p className="text-gray-600 max-w-2xl mx-auto">
              Three interconnected systems working together to deliver
              personalized, evidence-based music therapy at scale.
            </p> */}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white rounded-lg border border-gray-100 hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 to-teal-500"></div>

              <div className="mb-5 flex items-center gap-4">
                <div className="bg-linear-to-br from-blue-600 to-teal-500 p-3 rounded-lg shadow-sm">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {pillar.title}
                </h3>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Capabilities Section --- */}
      <section className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <Target className="h-7 w-7 text-blue-600" />
            <h2 className="text-2xl font-serif tracking-tight font-bold text-gray-900">
              Clinical Capabilities
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {features?.map((feature) => (
              <FeatureCard
                key={feature?.title}
                description={feature?.description}
                title={feature?.title}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>
      {/* </div> */}
    </div>
  );
}
