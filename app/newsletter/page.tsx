"use client";

import { Newspaper, ExternalLink, Calendar } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

export const dynamic = "force-dynamic";

const releaseDate = formatDate(new Date().toISOString());

const newsletterArticles = [
  {
    id: 1,
    title: "Why singing is surprisingly good for your health",
    url: "https://www.bbc.com/future/article/20251128-how-singing-can-improve-your-health",
    source: "BBC Future",
    date: "2025-11-28",
    description: "Discover the surprising health benefits of singing and how it can improve both physical and mental wellbeing."
  },
  {
    id: 2,
    title: "Does music make animals calmer?",
    url: "https://www.bbc.com/future/article/20251121-does-music-make-animals-calmer",
    source: "BBC Future",
    date: "2025-11-21",
    description: "Explore the fascinating research on how music affects animal behavior and whether it can help calm our furry friends."
  }
];

export default function NewsletterPage() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto space-y-6 bg-linear-to-br from-slate-50 to-blue-50/30 py-8">
      {/* --- Header Section --- */}
      <section className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="p-3 lg:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-linear-to-br from-blue-600 to-teal-500 p-3 rounded-lg shadow-sm">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-0">
                <h1 className="text-xl lg:text-2xl font-serif tracking-tight font-bold text-gray-900">
                  Newsletter
                </h1>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Latest
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                Last updated: {releaseDate}
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-justify leading-relaxed">
              Stay updated with the latest research and insights on music therapy,
              wellness, and the therapeutic power of music from trusted sources like BBC Future.
            </p>
          </div>
        </div>
      </section>

      {/* --- Articles Section --- */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif tracking-tight font-bold text-gray-900 mb-2">
            Featured Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated content exploring the intersection of music, health, and wellbeing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {newsletterArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg border border-gray-100 hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 to-teal-500"></div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.date)}
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">{article.source}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {article.description}
                </p>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                >
                  Read Article
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}