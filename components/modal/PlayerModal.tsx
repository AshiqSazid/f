"use client";
import CustomPlayer from "../player/CustomPlayer";

const PlayerModal = ({
  playerUrl,
  closeModal,
}: {
  playerUrl: string;
  closeModal: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      // onClick={closeModal}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      <div
        className="bg-linear-to-br from-gray-900 to-black rounded-2xl p-6 max-w-3xl w-full relative shadow-2xl border border-gray-800 transform transition-all duration-300 ease-out animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Header with gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 shadow-lg hover:shadow-xl hover:scale-110 group cursor-pointer"
          aria-label="Close player"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal header */}
        <div className="mb-6 pt-2">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-gray-100 to-gray-300">
              Now Playing
            </h2>
            <div className="flex-1 h-px bg-linear-to-r from-gray-800 to-transparent ml-3"></div>
          </div>
          <p className="text-gray-400 text-sm mt-2 truncate">
            {playerUrl.includes("youtube.com")
              ? "YouTube Video"
              : playerUrl.includes("spotify.com")
              ? "Spotify Track"
              : "Media Content"}
          </p>
        </div>

        {/* Player container with glass effect */}
        <div className="relative rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 shadow-inner">
          {/* Loading shimmer effect background */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-800/10 to-transparent animate-shimmer"></div>

          {/* Player */}
          <div className="relative z-10">
            <CustomPlayer url={playerUrl} />
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors duration-200 border border-gray-700/50 text-sm">
              <svg
                className="w-4 h-4"
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
              <span>Previous</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors duration-200 border border-gray-700/50 text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>Next</span>
            </button>
          </div>

          <button
            onClick={() => window.open(playerUrl, "_blank")}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200 hover:shadow-lg hover:scale-105 text-sm font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span>Open Original</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
