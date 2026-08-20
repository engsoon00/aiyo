import { useRef } from "react";

import { useFadeLoopVideo } from "@/hooks/useFadeLoopVideo";

export const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4";

interface BackgroundVideoProps {
  src?: string;
}

/**
 * Full-bleed hero video. Starts at zero opacity — the fade loop owns it from
 * there. Deliberately no gradient overlay; the blurred mass behind the copy
 * does the legibility work instead.
 */
export function BackgroundVideo({ src = HERO_VIDEO_SRC }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useFadeLoopVideo(videoRef);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: 0 }}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}
