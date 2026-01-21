import { FC, ReactNode } from "react";

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const RecommendationModal: FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,28,26,0.25)] p-3 backdrop-blur-sm lg:p-6">
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/70 bg-[rgba(244,241,236,0.96)] shadow-2xl lg:max-w-[88%]">
        {/* Enhanced sticky header with drag indicator */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E6DED4] bg-[rgba(244,241,236,0.96)] px-4 py-4 md:px-6">
          <div className="flex items-center space-x-2">
            {/* <div className="w-16 h-1.5 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing transition-colors hover:bg-gray-400" /> */}
            <span className="text-sm font-semibold text-[#8B857D]">
              Recommended Songs
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center space-x-2 rounded-full border border-[#E6DED4] bg-white/80 px-4 py-2 text-sm font-semibold text-[#5A5A5A] transition hover:-translate-y-0.5"
            aria-label="Previous page"
          >
            <svg
              className="h-4 w-4 text-[#5A5A5A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-semibold text-[#5A5A5A]">
              Previous Page
            </span>
          </button>
        </div>

        {/* Content area with proper scrolling */}
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;
