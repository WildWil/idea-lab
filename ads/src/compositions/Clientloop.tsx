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
import { instrumentSerif, generalSansFamily } from "../fonts";
import { getAudioDuration } from "../utils/getAudioDuration";
import { useCaptions } from "../captions/useCaptions";
import { CaptionOverlay } from "../captions/CaptionOverlay";

const COLORS = {
  bg: "#FBF9F6",
  charcoal: "#1C1C1C",
  beige: "#EDE3D3",
  clay: "#A85C32",
  clayDeep: "#8A4A27",
  inkSoft: "#6B6459",
};

const FPS = 30;
const INTRO_FRAMES = 9;
const OUTRO_HOLD_FRAMES = 45;
const RESOLUTION_START = 88;

type Props = {
  readonly audioDurationInFrames: number;
};

export const clientloopMetadata: CalculateMetadataFunction<
  Props
> = async () => {
  const durationInSeconds = await getAudioDuration(
    staticFile("voiceover/clientloop.mp3"),
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
        position: "absolute",
        top: 100,
        left: 80,
        fontFamily: instrumentSerif.fontFamily,
        fontSize: 36,
        color: COLORS.charcoal,
        opacity,
      }}
    >
      clientloop<span style={{ color: COLORS.clayDeep }}>.</span>
    </div>
  );
};

// A tighter, overlapping cluster read as "a pile of messages" rather than
// scattered dots with dead space between them. Slight rotation sells the
// hand-scattered feel without needing to spread across the whole frame.
const FRAGMENTS = [
  { text: "“any update on this?”", top: 480, left: 70, rotate: -3 },
  { text: "“can you resend the invoice”", top: 590, left: 360, rotate: 2 },
  { text: "“just following up!”", top: 700, left: 130, rotate: -2 },
];

const Fragments: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {FRAGMENTS.map((fragment, i) => {
        const delay = 8 + i * 8;
        const local = frame - delay;
        const fadeIn = interpolate(local, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(local, [42, 58], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const opacity = Math.min(fadeIn, fadeOut);
        const rise = interpolate(local, [0, 10], [12, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={fragment.text}
            style={{
              position: "absolute",
              top: fragment.top,
              left: fragment.left,
              maxWidth: 560,
              background: "#FFFFFF",
              border: `1px solid #E0D9CC`,
              borderRadius: 14,
              padding: "20px 26px",
              fontFamily: generalSansFamily,
              fontWeight: 500,
              fontSize: 34,
              color: COLORS.charcoal,
              opacity,
              transform: `rotate(${fragment.rotate}deg) translateY(${rise}px)`,
              boxShadow: "0 14px 30px -14px rgba(28,28,28,0.22)",
            }}
          >
            {fragment.text}
          </div>
        );
      })}
    </>
  );
};

const Resolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - RESOLUTION_START;
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
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: instrumentSerif.fontFamily,
            fontSize: 88,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            color: COLORS.charcoal,
            marginBottom: 48,
          }}
        >
          One link.
          <br />
          Not an inbox.
        </div>
        <div
          style={{
            background: COLORS.charcoal,
            color: COLORS.beige,
            borderRadius: 20,
            padding: "40px 56px",
            width: "100%",
            maxWidth: 860,
          }}
        >
          <div
            style={{
              fontFamily: generalSansFamily,
              fontSize: 22,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#B8B0A2",
              marginBottom: 14,
            }}
          >
            Everything, one place
          </div>
          <div
            style={{
              fontFamily: generalSansFamily,
              fontWeight: 600,
              fontSize: 52,
            }}
          >
            clientloop.co/<span style={{ color: COLORS.clay }}>acme</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Content: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: generalSansFamily,
      }}
    >
      <Wordmark />
      <Fragments />
      <Resolution />
    </AbsoluteFill>
  );
};

export const Clientloop: React.FC<Props> = () => {
  const captions = useCaptions("voiceover/clientloop.json");

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Content />
      <Sequence from={INTRO_FRAMES}>
        <Audio src={staticFile("voiceover/clientloop.mp3")} />
        {captions ? (
          <CaptionOverlay
            captions={captions}
            accentColor={COLORS.clayDeep}
            baseColor={COLORS.inkSoft}
            fontFamily={generalSansFamily}
          />
        ) : null}
      </Sequence>
    </AbsoluteFill>
  );
};
