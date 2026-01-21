"use client";
import { useEffect, useState, type SyntheticEvent } from "react";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface CustomPlayerProps {
  url: string;
}
const Player = ReactPlayer as any;
const CustomPlayer = ({ url }: CustomPlayerProps) => {
  // console.log("URL:", url);
  const [playerError, setPlayerError] = useState<string | null>(null);

  useEffect(() => {
    setPlayerError(null);
  }, [url]);

  const handleError = (event: SyntheticEvent<HTMLVideoElement>) => {
    const target = event.currentTarget as HTMLVideoElement & {
      error?: { code?: number; message?: string } | null;
    };
    const error = target?.error;
    const code = error?.code;
    if (code === 101 || code === 150) {
      setPlayerError(
        "This video can't be embedded. Use Open Original to watch it on YouTube."
      );
      return;
    }
    if (code === 100) {
      setPlayerError("This video is unavailable or has been removed.");
      return;
    }
    if (code === 2) {
      setPlayerError("This video link looks invalid.");
      return;
    }
    if (code === 5) {
      setPlayerError("The player could not load this video.");
      return;
    }
    setPlayerError(
      error?.message || "Playback failed. Try opening the original link."
    );
  };

  return (
    <div
      style={{
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <Player
        src={url}
        controls={true}
        width="100%"
        height="360px"
        style={{ borderRadius: 8 }}
        onError={handleError}
        config={{
          youtube: {
            modestbranding: 1,
            rel: 0,
            color: "white", // White progress bar
            fs: 0, // Hide fullscreen button
            iv_load_policy: 3, // Hide video annotations
            origin:
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
        }}
      />
      {playerError ? (
        <div className="mt-2 text-sm text-gray-200">{playerError}</div>
      ) : null}
    </div>
  );
};

export default CustomPlayer;
