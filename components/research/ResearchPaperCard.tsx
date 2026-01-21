"use client";
import { ResearchPaper } from "@/lib/researchEvidence";

const ResearchPaperCard = ({ paper }: { paper: ResearchPaper }) => {
  return (
    <article className="bg-gray-50 rounded-lg p-3 lg:p-5 border border-gray-200 hover:shadow transition-shadow duration-300">
      <h3 className="text-sm lg:text-lg font-semibold text-gray-800">
        {paper.title}
      </h3>
      <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
        {paper.citation}
      </p>
      {paper.studyDesign ? (
        <p className="mt-2 text-sm text-gray-600">
          Study Design: {paper.studyDesign}
        </p>
      ) : null}
      {paper.sample ? (
        <p className="mt-1 text-sm text-gray-600">Sample: {paper.sample}</p>
      ) : null}
      {paper.intervention ? (
        <p className="mt-1 text-sm text-gray-600">
          Intervention:{" "}
          <span className="font-medium text-gray-700">
            {paper.intervention}
          </span>
        </p>
      ) : null}
      {paper.frequency ? (
        <p className="mt-1 text-sm text-gray-600">
          Frequency:{" "}
          <span className="font-medium text-gray-700">{paper.frequency}</span>
        </p>
      ) : null}
      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        {paper.keyFindings.map((finding) => (
          <li key={finding} className="flex gap-2">
            <span
              className="mt-1 inline-block h-2 w-2 rounded-full bg-[#338aff]"
              aria-hidden
            />
            <span>{finding}</span>
          </li>
        ))}
      </ul>
      {paper.significance ? (
        <p className="mt-3 text-sm text-gray-600">{paper.significance}</p>
      ) : null}
      {paper.application ? (
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-semibold text-gray-700">Application:</span>{" "}
          {paper.application}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3">
        {paper.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#338aff] underline hover:text-[#1e6fff]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
};

export default ResearchPaperCard;
