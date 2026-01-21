import { DetailedCompilationSection } from "@/lib/researchEvidence";
import { ChevronDown } from "lucide-react";

interface DetailsCardProps {
  title: string;
  description?: string;
  sections: DetailedCompilationSection[];
}

const DetailsCard = ({ title, description, sections }: DetailsCardProps) => {
  return (
    <section className="p-3 lg:p-6 bg-white rounded-lg border border-gray-100">
      <details className="group">
        <summary className="flex cursor-pointer items-center justify-between text-left text-sm lg:text-lg font-semibold text-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <ChevronDown className="h-5 w-5 text-[#338aff] transition-transform duration-200 group-open:rotate-180" />
              <span>{title}</span>
            </div>
            {description ? (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            ) : null}
          </div>
        </summary>

        <div className="mt-6 space-y-6">
          {sections.map((section) => (
            <div
              key={section.heading}
              className="rounded-sm border border-gray-100 bg-blue-50 p-4"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {section.heading}
              </h3>
              {section.description ? (
                <p className="mt-2 text-sm text-gray-600">
                  {section.description}
                </p>
              ) : null}

              {section.entries ? (
                <div className="mt-4 space-y-4">
                  {section.entries.map((entry) => (
                    <div
                      key={entry.title}
                      className="rounded-lg border border-gray-100 bg-white p-4 transition hover:border-[#338aff] hover:shadow"
                    >
                      <h4 className="text-base font-semibold text-gray-800">
                        {entry.title}
                      </h4>
                      <p className="mt-2 text-sm text-gray-600">
                        {entry.details}
                      </p>
                      {entry.keyPoints ? (
                        <ul className="mt-3 space-y-2 text-sm text-gray-700">
                          {entry.keyPoints.map((point) => (
                            <li key={point} className="flex gap-2">
                              <span
                                className="mt-1 inline-block h-2 w-2 rounded-full bg-[#338aff]"
                                aria-hidden
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {entry.links ? (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {entry.links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              className="text-xs font-semibold text-[#338aff] underline decoration-accent-teal/40 hover:text-[#1e6fff]"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {section.bullets ? (
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
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
              ) : null}

              {section.paragraphs ? (
                <div className="mt-3 space-y-3 text-sm text-gray-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </details>
    </section>
  );
};

export default DetailsCard;
