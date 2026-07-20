import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { Audio } from "@remotion/media";
import type { CalculateMetadataFunction } from "remotion";
import { spaceGrotesk, jetBrainsMono, publicSans } from "../fonts";
import { getAudioDuration } from "../utils/getAudioDuration";
import { useCaptions } from "../captions/useCaptions";
import { CaptionOverlay } from "../captions/CaptionOverlay";
import type { Caption } from "@remotion/captions";

const COLORS = {
  bg: "#0F172A",
  text: "#ECEFEC",
  muted: "#94A3B8",
  accent: "#2563EB",
  add: "#3FB950",
};

const FPS = 30;
const INTRO_FRAMES = 9;
const OUTRO_HOLD_FRAMES = 40;

type Props = {
  readonly audioDurationInFrames: number;
};

export const shiplogMetadata: CalculateMetadataFunction<Props> = async () => {
  const durationInSeconds = await getAudioDuration(
    staticFile("voiceover/shiplog.mp3"),
  );
  const audioDurationInFrames = Math.ceil(durationInSeconds * FPS);

  return {
    durationInFrames: INTRO_FRAMES + audioDurationInFrames + OUTRO_HOLD_FRAMES,
    props: { audioDurationInFrames },
  };
};

const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontFamily: spaceGrotesk.fontFamily,
        fontWeight: 700,
        fontSize: 34,
        color: COLORS.text,
        opacity,
      }}
    >
      shiplog<span style={{ color: COLORS.accent }}>.</span>
    </div>
  );
};

const DiffLines: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = [
    { text: "Shipped: a changelog that writes itself", delay: 6 },
    { text: "No more midnight release notes", delay: 26 },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        marginTop: 48,
      }}
    >
      {lines.map((line, i) => {
        const local = frame - line.delay;
        const opacity = interpolate(local, [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = interpolate(local, [0, 12], [-16, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              fontFamily: jetBrainsMono.fontFamily,
              fontSize: 30,
              opacity,
              transform: `translateX(${x}px)`,
            }}
          >
            <span style={{ color: COLORS.add }}>+</span>
            <span style={{ color: "#C9D1D9" }}>{line.text}</span>
          </div>
        );
      })}
    </div>
  );
};

const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 58;
  const local = frame - start;
  const progress = spring({
    frame: local,
    fps: FPS,
    config: { damping: 200, mass: 0.6 },
  });
  const opacity = interpolate(local, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (local < -5) return null;

  return (
    <div
      style={{
        marginTop: 56,
        opacity,
        transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: spaceGrotesk.fontFamily,
          fontWeight: 600,
          fontSize: 92,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          color: COLORS.text,
        }}
      >
        A changelog
        <br />
        people actually
        <br />
        read.
      </div>
    </div>
  );
};

const Content: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: publicSans.fontFamily,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingTop: 110,
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      <Wordmark />
      <DiffLines />
      <Headline />
    </AbsoluteFill>
  );
};

export const Shiplog: React.FC<Props> = () => {
  const captions = useCaptions("voiceover/shiplog.json");

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Visuals play continuously across the whole timeline, not reset per-sequence. */}
      <Content />
      <Sequence from={INTRO_FRAMES}>
        <Audio src={staticFile("voiceover/shiplog.mp3")} />
        {captions ? (
          <CaptionOverlay
            captions={captions}
            accentColor={COLORS.accent}
            baseColor={COLORS.muted}
            fontFamily={publicSans.fontFamily}
          />
        ) : null}
      </Sequence>
    </AbsoluteFill>
  );
};
