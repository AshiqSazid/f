"use client";
import { ResearchCategory } from "@/lib/researchEvidence";
import ResearchPaperCard from "./ResearchPaperCard";

const CategoryCard = ({ category }: { category: ResearchCategory }) => {
  return (
    <section className="p-3 lg:p-6 bg-white rounded-lg border border-gray-100">
      <h2 className="text-sm lg:text-xl font-semibold text-gray-800">
        {category.heading}
      </h2>
      {category.description ? (
        <p className="mt-0 text-xs lg:text-sm text-gray-600">
          {category.description}
        </p>
      ) : null}
      <div className="mt-4 space-y-5">
        {category.papers.map((paper) => (
          <ResearchPaperCard key={paper.title} paper={paper} />
        ))}
      </div>
    </section>
  );
};

export default CategoryCard;
