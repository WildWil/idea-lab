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

const FRAGMENTS = [
  { text: "“any update on this?”", top: 300, left: 60 },
  { text: "“can you resend the invoice”", top: 420, left: 420 },
  { text: "“just following up!”", top: 540, left: 140 },
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

        return (
          <div
            key={fragment.text}
            style={{
              position: "absolute",
              top: fragment.top,
              left: fragment.left,
              maxWidth: 460,
              background: "#FFFFFF",
              border: `1px solid #E7E1D8`,
              borderRadius: 12,
              padding: "16px 20px",
              fontFamily: generalSansFamily,
              fontSize: 28,
              color: COLORS.inkSoft,
              opacity,
              boxShadow: "0 10px 24px -12px rgba(28,28,28,0.16)",
            }}
          >
            {fragment.text}
          </div>
        );
      })}
    </>
  );
};

const LinkCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 88;
  const local = frame - start;
  const progress = spring({
    frame: local,
    fps,
    config: { damping: 200, mass: 0.6 },
  });
  const opacity = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (local < -5) return null;

  return (
    <div
      style={{
        marginTop: 420,
        opacity,
        transform: `scale(${interpolate(progress, [0, 1], [0.94, 1])})`,
      }}
    >
      <div
        style={{
          background: COLORS.charcoal,
          color: COLORS.beige,
          borderRadius: 16,
          padding: "36px 44px",
          display: "inline-block",
        }}
      >
        <div
          style={{
            fontFamily: generalSansFamily,
            fontSize: 20,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#B8B0A2",
            marginBottom: 10,
          }}
        >
          Everything, one place
        </div>
        <div
          style={{
            fontFamily: generalSansFamily,
            fontWeight: 600,
            fontSize: 40,
          }}
        >
          clientloop.co/<span style={{ color: COLORS.clay }}>acme</span>
        </div>
      </div>
    </div>
  );
};

const Content: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: generalSansFamily,
        paddingTop: 100,
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      <Wordmark />
      <Fragments />
      <LinkCard />
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
