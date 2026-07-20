import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import type { CalculateMetadataFunction } from "remotion";
import { spaceGrotesk, jetBrainsMono, publicSans } from "../fonts";
import { getAudioDuration } from "../utils/getAudioDuration";
import { useCaptions } from "../captions/useCaptions";
import { CaptionOverlay } from "../captions/CaptionOverlay";
import {
  AmbientBackground,
  Grain,
  RiseIn,
  FadeSlide,
  EndCard,
  useBeat,
  useCameraDrift,
  type Brand,
} from "../ui";

const BRAND: Brand = {
  bg: "#0F172A",
  ink: "#ECEFEC",
  muted: "#94A3B8",
  accent: "#2563EB",
  glow: "rgba(37,99,235,0.26)",
  glowX: 42,
  glowY: -8,
  glowSpread: 72,
  vignette: "rgba(3,7,18,0.55)",
  grainOpacity: 0.08,
  grainBlend: "overlay",
};

const ADD = "#3FB950";
const CHG = "#D29922";
const CARD = "#161B22";
const BORDER = "#273244";

const FPS = 30;
const INTRO_FRAMES = 9;
const OUTRO_FRAMES = 66;

type Props = { readonly audioDurationInFrames: number };

export const shiplogMetadata: CalculateMetadataFunction<Props> = async () => {
  const seconds = await getAudioDuration(staticFile("voiceover/shiplog.mp3"));
  const audioDurationInFrames = Math.ceil(seconds * FPS);
  return {
    durationInFrames: INTRO_FRAMES + audioDurationInFrames + OUTRO_FRAMES,
    props: { audioDurationInFrames },
  };
};

/* Beat 1 — the hook */
const Hook: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 90px",
      }}
    >
      <FadeSlide delay={4} from={16}>
        <div
          style={{
            fontFamily: jetBrainsMono.fontFamily,
            fontSize: 30,
            color: BRAND.muted,
            marginBottom: 30,
          }}
        >
          $ git log <span style={{ color: ADD }}>| shiplog</span>
        </div>
      </FadeSlide>
      <div
        style={{
          fontFamily: spaceGrotesk.fontFamily,
          fontWeight: 600,
          fontSize: 108,
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          color: BRAND.ink,
        }}
      >
        <RiseIn delay={10} blur>
          A changelog
        </RiseIn>
        <RiseIn delay={19} blur>
          that writes
        </RiseIn>
        <RiseIn delay={28} blur>
          itself.
        </RiseIn>
      </div>
    </AbsoluteFill>
  );
};

const DIFF = [
  { marker: "+", color: ADD, text: "Custom domains for your changelog" },
  { marker: "+", color: ADD, text: "RSS feed for every project" },
  { marker: "~", color: CHG, text: "Entries group by week when you ship" },
];

/* Beat 2 — the product surface */
const Product: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}
    >
      <FadeSlide delay={startFrame} from={40}>
        <div
          style={{
            width: 900,
            maxWidth: "100%",
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 40px 90px -30px rgba(0,0,0,0.7)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 26px",
              borderBottom: `1px solid ${BORDER}`,
              background: "#1C2330",
              fontFamily: jetBrainsMono.fontFamily,
              fontSize: 22,
              color: BRAND.muted,
            }}
          >
            <span style={{ display: "flex", gap: 8 }}>
              <Dot c="#F85149" />
              <Dot c="#D29922" />
              <Dot c="#3FB950" />
            </span>
            <span style={{ color: BRAND.ink, marginLeft: 8 }}>
              shiplog.dev/changelog
            </span>
            <LiveTag />
          </div>
          <div style={{ padding: "30px 34px 38px" }}>
            <div
              style={{
                fontFamily: jetBrainsMono.fontFamily,
                fontSize: 26,
                marginBottom: 22,
                display: "flex",
                gap: 16,
                alignItems: "baseline",
              }}
            >
              <span style={{ color: BRAND.accent, fontWeight: 700 }}>v0.4.0</span>
              <span style={{ color: BRAND.muted, fontSize: 22 }}>
                released today
              </span>
            </div>
            {DIFF.map((line, i) => {
              const t = local - 14 - i * 9;
              const opacity = interpolate(t, [0, 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const x = interpolate(t, [0, 10], [-14, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    fontFamily: jetBrainsMono.fontFamily,
                    fontSize: 27,
                    padding: "7px 0",
                    opacity,
                    transform: `translateX(${x}px)`,
                  }}
                >
                  <span style={{ color: line.color, width: "1ch" }}>
                    {line.marker}
                  </span>
                  <span style={{ color: "#C9D1D9" }}>{line.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </FadeSlide>
    </AbsoluteFill>
  );
};

const Dot: React.FC<{ c: string }> = ({ c }) => (
  <span
    style={{
      width: 14,
      height: 14,
      borderRadius: 999,
      background: c,
      display: "inline-block",
    }}
  />
);

const LiveTag: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.3);
  return (
    <span
      style={{
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 20,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: ADD,
          opacity: 0.4 + pulse * 0.6,
        }}
      />
      auto-updated
    </span>
  );
};

export const Shiplog: React.FC<Props> = () => {
  const { durationInFrames } = useVideoConfig();
  const captions = useCaptions("voiceover/shiplog.json");

  const mid = Math.round(durationInFrames * 0.4);
  const endCardStart = durationInFrames - 60;

  const beat1 = useBeat(6, mid);
  const beat2 = useBeat(mid - 10, endCardStart);
  const camera = useCameraDrift();

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg, fontFamily: publicSans.fontFamily }}>
      <AmbientBackground brand={BRAND} />

      <AbsoluteFill style={camera}>
        {beat1.visible ? (
          <AbsoluteFill style={{ opacity: beat1.opacity }}>
            <Hook />
          </AbsoluteFill>
        ) : null}
        {beat2.visible ? (
          <AbsoluteFill style={{ opacity: beat2.opacity }}>
            <Product startFrame={mid - 10} />
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>

      <EndCard
        brand={BRAND}
        wordmark={
          <>
            shiplog<span style={{ color: BRAND.accent }}>.</span>
          </>
        }
        line="Ship a changelog people actually read."
        url="idea-lab.uk/shiplog"
        startAt={endCardStart}
        wordmarkFont={spaceGrotesk.fontFamily}
        bodyFont={publicSans.fontFamily}
      />

      <Grain brand={BRAND} id="shiplog" />

      <Sequence from={INTRO_FRAMES}>
        <Audio src={staticFile("voiceover/shiplog.mp3")} />
        {captions ? (
          <CaptionOverlay
            captions={captions}
            accentColor={BRAND.accent}
            baseColor={BRAND.muted}
            fontFamily={publicSans.fontFamily}
          />
        ) : null}
      </Sequence>
    </AbsoluteFill>
  );
};
