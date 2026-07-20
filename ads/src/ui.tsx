import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ------------------------------------------------------------------ *
 * Brand tokens
 * ------------------------------------------------------------------ */

export type Brand = {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  // Ambient glow: color + where it sits + how far it drifts.
  glow: string;
  glowX: number; // 0..100 (% of width), starting center of glow
  glowY: number;
  vignette: string | null; // rgba for corner darkening, or null
  grainOpacity: number;
  grainBlend: "overlay" | "soft-light";
};

/* ------------------------------------------------------------------ *
 * Camera drift — nothing in a real ad sits perfectly still.
 * Slow scale + vertical parallax across the whole clip.
 * ------------------------------------------------------------------ */

export const useCameraDrift = (from = 1.0, to = 1.05) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(p, [0, 1], [from, to]);
  const y = interpolate(p, [0, 1], [10, -10]);
  return { transform: `scale(${scale}) translateY(${y}px)` };
};

/* ------------------------------------------------------------------ *
 * Ambient background: base color, drifting brand glow, vignette.
 * ------------------------------------------------------------------ */

export const AmbientBackground: React.FC<{ brand: Brand }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;

  // Slow, organic drift via layered sines.
  const driftX = Math.sin(p * Math.PI * 1.4) * 6;
  const driftY = Math.cos(p * Math.PI * 1.1) * 5;
  const breathe = 1 + Math.sin(p * Math.PI * 2) * 0.06;

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          background: `radial-gradient(closest-side, ${brand.glow}, transparent 70%)`,
          left: `${brand.glowX - 20 + driftX}%`,
          top: `${brand.glowY - 20 + driftY}%`,
          width: "80%",
          height: "80%",
          transform: `scale(${breathe})`,
          filter: "blur(8px)",
        }}
      />
      {brand.vignette ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 120% 100% at 50% 45%, transparent 55%, ${brand.vignette})`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 * Film grain: desaturated animated noise, blended over everything.
 * ------------------------------------------------------------------ */

export const Grain: React.FC<{ brand: Brand; id: string }> = ({
  brand,
  id,
}) => {
  const frame = useCurrentFrame();
  const seed = frame % 12;
  return (
    <AbsoluteFill
      style={{
        opacity: brand.grainOpacity,
        mixBlendMode: brand.grainBlend,
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%">
        <filter id={`grain-${id}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 * RiseIn: a single line rising from behind a mask edge, spring-eased.
 * Compose several with staggered delays for kinetic headlines.
 * ------------------------------------------------------------------ */

export const RiseIn: React.FC<{
  delay?: number;
  children: React.ReactNode;
  blur?: boolean;
}> = ({ delay = 0, children, blur = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const p = spring({ frame: local, fps, config: { damping: 200, mass: 0.7 } });
  const y = interpolate(p, [0, 1], [105, 0]);
  const blurPx = blur
    ? interpolate(local, [0, 12], [10, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  return (
    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em" }}>
      <span
        style={{
          display: "block",
          transform: `translateY(${y}%)`,
          filter: blurPx ? `blur(${blurPx}px)` : undefined,
        }}
      >
        {children}
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ *
 * FadeSlide: softer entrance for supporting elements / cards.
 * ------------------------------------------------------------------ */

export const FadeSlide: React.FC<{
  delay?: number;
  from?: number; // starting y offset in px
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, from = 28, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const p = spring({ frame: local, fps, config: { damping: 200, mass: 0.6 } });
  const y = interpolate(p, [0, 1], [from, 0]);
  const opacity = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ ...style, transform: `translateY(${y}px)`, opacity }}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * useBeat: opacity/scale for a beat that enters, holds, and exits.
 * All values in absolute composition frames.
 * ------------------------------------------------------------------ */

export const useBeat = (inAt: number, outAt: number) => {
  const frame = useCurrentFrame();
  const opacity =
    interpolate(frame, [inAt, inAt + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [outAt - 12, outAt], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const scale = interpolate(frame, [inAt, outAt], [1, 1.04]);
  return { opacity, scale, visible: frame >= inAt - 2 && frame <= outAt + 2 };
};

/* ------------------------------------------------------------------ *
 * End card: wordmark + one line + URL pill. Every real ad closes here.
 * ------------------------------------------------------------------ */

export const EndCard: React.FC<{
  brand: Brand;
  wordmark: React.ReactNode;
  line: React.ReactNode;
  url: string;
  startAt: number;
  wordmarkFont: string;
  bodyFont: string;
}> = ({ brand, wordmark, line, url, startAt, wordmarkFont, bodyFont }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startAt;
  if (local < -6) return null;

  const p = spring({ frame: local, fps, config: { damping: 200, mass: 0.7 } });
  const opacity = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 90px",
        opacity,
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: wordmarkFont,
            fontSize: 92,
            color: brand.ink,
            lineHeight: 1,
            marginBottom: 30,
          }}
        >
          {wordmark}
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontSize: 40,
            color: brand.muted,
            maxWidth: 780,
            lineHeight: 1.3,
            marginBottom: 44,
          }}
        >
          {line}
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 32,
            color: brand.accent,
            border: `2px solid ${brand.accent}`,
            borderRadius: 999,
            padding: "16px 36px",
          }}
        >
          {url}
        </div>
      </div>
    </AbsoluteFill>
  );
};
