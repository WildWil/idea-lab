import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import type { CalculateMetadataFunction } from "remotion";
import { playfairDisplay, manrope } from "../fonts";
import { getAudioDuration } from "../utils/getAudioDuration";
import { useCaptions } from "../captions/useCaptions";
import { CaptionOverlay } from "../captions/CaptionOverlay";

const COLORS = {
  bg: "#FAF9F6",
  navy: "#11233F",
  slate: "#5B6B7E",
  gold: "#7D5F26",
};

const FPS = 30;
const INTRO_FRAMES = 9;
const OUTRO_HOLD_FRAMES = 40;
const TICKER_TARGET = 4280;

type Props = {
  readonly audioDurationInFrames: number;
};

export const saveflowMetadata: CalculateMetadataFunction<Props> = async () => {
  const durationInSeconds = await getAudioDuration(
    staticFile("voiceover/saveflow.mp3"),
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
        fontFamily: playfairDisplay.fontFamily,
        fontWeight: 700,
        fontSize: 32,
        color: COLORS.navy,
        opacity,
      }}
    >
      saveflow<span style={{ color: COLORS.gold }}>.</span>
    </div>
  );
};

const Ticker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 12;
  const local = Math.max(0, frame - start);
  const progress = spring({
    frame: local,
    fps,
    config: { damping: 26, mass: 1.4 },
    durationInFrames: 45,
  });
  const value = Math.round(interpolate(progress, [0, 1], [0, TICKER_TARGET]));
  const opacity = interpolate(frame - start, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ marginTop: 64, opacity }}>
      <div
        style={{
          fontFamily: manrope.fontFamily,
          fontWeight: 700,
          fontSize: 128,
          color: COLORS.gold,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        ${value.toLocaleString()}
      </div>
      <div
        style={{
          fontFamily: manrope.fontFamily,
          fontWeight: 500,
          fontSize: 34,
          color: COLORS.slate,
          marginTop: 16,
        }}
      >
        recovered automatically
      </div>
    </div>
  );
};

const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 66;
  const local = frame - start;
  const progress = spring({
    frame: local,
    fps,
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
        marginTop: 72,
        opacity,
        transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: playfairDisplay.fontFamily,
          fontWeight: 600,
          fontSize: 68,
          lineHeight: 1.12,
          letterSpacing: "-0.01em",
          color: COLORS.navy,
        }}
      >
        Card declined.
        <br />
        Customer doesn&rsquo;t
        <br />
        have to be gone.
      </div>
    </div>
  );
};

const Content: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: manrope.fontFamily,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingTop: 110,
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      <Wordmark />
      <Ticker />
      <Headline />
    </AbsoluteFill>
  );
};

export const Saveflow: React.FC<Props> = () => {
  const captions = useCaptions("voiceover/saveflow.json");

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Content />
      <Sequence from={INTRO_FRAMES}>
        <Audio src={staticFile("voiceover/saveflow.mp3")} />
        {captions ? (
          <CaptionOverlay
            captions={captions}
            accentColor={COLORS.gold}
            baseColor={COLORS.slate}
            fontFamily={manrope.fontFamily}
          />
        ) : null}
      </Sequence>
    </AbsoluteFill>
  );
};
