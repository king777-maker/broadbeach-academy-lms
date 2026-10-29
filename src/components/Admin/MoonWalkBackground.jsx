import React, { useEffect, useRef, useState } from "react";

/**
 * MoonWalkBackground — Cinematic 4K Video Background with 2K Poster Fallback
 * 
 * Features:
 * - Autoplays muted, loops continuously, playsInline
 * - Immediate fallback to static poster on error, low-power, or reduced-motion
 * - Auto-pauses on document visibility loss to save battery & CPU/GPU
 * - Clean lifecycle tracking to prevent interrupted autoplay unhandled exceptions
 * - Non-blocking pointer events (pointer-events-none)
 */
export default function MoonWalkBackground() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [useFallbackPoster, setUseFallbackPoster] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Reduced motion check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setUseFallbackPoster(true);
      return;
    }

    const safePlay = () => {
      if (!isMounted || !videoRef.current) return;
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined && typeof playPromise.catch === "function") {
          playPromise.catch((err) => {
            if (!isMounted) return;
            // Ignore benign AbortError triggered by unmount or tab switch
            if (err.name !== "AbortError") {
              setUseFallbackPoster(true);
            }
          });
        }
      } catch {
        if (isMounted) setUseFallbackPoster(true);
      }
    };

    const handleMotionChange = (e) => {
      if (!isMounted) return;
      setUseFallbackPoster(e.matches);
      if (e.matches && videoRef.current) {
        try { videoRef.current.pause(); } catch {}
      } else if (!e.matches) {
        safePlay();
      }
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // 2. Document visibility listener
    const handleVisibility = () => {
      if (!isMounted || !videoRef.current) return;
      if (document.hidden) {
        try { videoRef.current.pause(); } catch {}
      } else if (!mediaQuery.matches) {
        safePlay();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 3. Autoplay attempt
    safePlay();

    return () => {
      isMounted = false;
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch {}
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[#050D1A]"
      aria-hidden="true"
    >
      {/* 4K Background Video with 2K Poster */}
      {!useFallbackPoster ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/admin/moon-walk.jpg"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setUseFallbackPoster(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-90"
          }`}
        >
          <source src="/assets/admin/moon-walk.mp4" type="video/mp4" />
        </video>
      ) : (
        /* Static 2K Poster Fallback for Reduced-Motion or Failed Playback */
        <img
          src="/assets/admin/moon-walk.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Restrained Broadbeach Navy Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%]_from-transparent_via-[#061224]/35_to-[#040B17]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050E1C]/60 via-transparent to-[#040A14]/75 pointer-events-none" />
    </div>
  );
}
