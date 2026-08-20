import { useEffect, type RefObject } from "react";

interface FadeLoopOptions {
  /** Seconds spent fading in at the start and out at the end of each pass. */
  fadeDuration?: number;
  /** Pause between the fade-out finishing and the clip restarting. */
  replayDelayMs?: number;
}

/**
 * Drives a video's opacity by hand instead of using native `loop`.
 *
 * Every frame the opacity is `min(t / FADE, (duration - t) / FADE)` clamped to
 * 0–1, which ramps up at the head and down at the tail from one expression.
 * When the clip ends we hold at zero briefly, then seek back and replay — so
 * the loop point is a soft dip rather than a hard cut.
 */
export function useFadeLoopVideo(
  ref: RefObject<HTMLVideoElement | null>,
  { fadeDuration = 0.5, replayDelayMs = 100 }: FadeLoopOptions = {}
) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let frame = 0;
    let replayTimer: number | undefined;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      const { currentTime, duration } = video;
      let opacity: number;

      if (!Number.isFinite(duration) || duration <= 0) {
        // Metadata not in yet — only the fade-in is knowable.
        opacity = currentTime / fadeDuration;
      } else {
        const fadeIn = currentTime / fadeDuration;
        const fadeOut = Math.max(duration - currentTime, 0) / fadeDuration;
        opacity = Math.min(fadeIn, fadeOut);
      }

      video.style.opacity = String(Math.min(Math.max(opacity, 0), 1));
      frame = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      replayTimer = window.setTimeout(() => {
        if (cancelled) return;
        video.currentTime = 0;
        void video.play().catch(() => {});
      }, replayDelayMs);
    };

    video.addEventListener("ended", handleEnded);
    void video.play().catch(() => {});
    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (replayTimer !== undefined) window.clearTimeout(replayTimer);
      video.removeEventListener("ended", handleEnded);
    };
  }, [ref, fadeDuration, replayDelayMs]);
}
