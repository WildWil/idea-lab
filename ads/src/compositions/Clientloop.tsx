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
import { instrumentSerif, generalSansFamily } from "../fonts";
import { getAudioDuration } from "../utils/getAudioDuration";
import { useCaptions } from "../captions/useCaptions";
import { CaptionOverlay } from "../captions/CaptionOverlay";
import {
  AmbientBackground,
  Grain,
  FadeSlide,
  EndCard,
  useBeat,
  useCameraDrift,
  type Brand,
} from "../ui";

const BRAND: Brand = {
  bg: "#FBF9F6",
  ink: "#1C1C1C",
  muted: "#6B6459",
  accent: "#8A4A27",
  glow: "rgba(168,92,50,0.15)",
  glowX: 55,
  glowY: -6,
  glowSpread: 72,
  vignette: "rgba(28,28,28,0.05)",
  grainOpacity: 0.05,
  grainBlend: "soft-light",
};

const CHARCOAL = "#1C1C1C";
const BEIGE = "#EDE3D3";
const CLAY = "#A85C32";
const LINE = "#E0D9CC";

const FPS = 30;
const INTRO_FRAMES = 9;
const OUTRO_FRAMES = 66;

type Props = { readonly audioDurationInFrames: number };

export const clientloopMetadata: CalculateMetadataFunction<
  Props
> = async () => {
  const seconds = await getAudioDuration(staticFile("voiceover/clientloop.mp3"));
  const audioDurationInFrames = Math.ceil(seconds * FPS);
  return {
    durationInFrames: INTRO_FRAMES + audioDurationInFrames + OUTRO_FRAMES,
    props: { audioDurationInFrames },
  };
};

const FRAGMENTS = [
  { text: "“any update on this?”", top: 360, left: 70, rotate: -3 },
  { text: "“can you resend the invoice?”", top: 560, left: 300, rotate: 2.5 },
  { text: "“just following up!”", top: 760, left: 120, rotate: -2 },
];

/* Beat 1 — the inbox chaos */
const Chaos: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {FRAGMENTS.map((f, i) => {
        const local = frame - startFrame - i * 8;
        const opacity = interpolate(local, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rise = interpolate(local, [0, 12], [16, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={f.text}
            style={{
              position: "absolute",
              top: f.top,
              left: f.left,
              maxWidth: 620,
              background: "#FFFFFF",
              border: `1px solid ${LINE}`,
              borderRadius: 16,
              padding: "22px 30px",
              fontFamily: generalSansFamily,
              fontWeight: 500,
              fontSize: 38,
              color: CHARCOAL,
              opacity,
              transform: `rotate(${f.rotate}deg) translateY(${rise}px)`,
              boxShadow: "0 16px 34px -16px rgba(28,28,28,0.24)",
            }}
          >
            {f.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const PORTAL_ROWS = [
  { label: "Project status", value: "In review" },
  { label: "Latest files", value: "3 shared" },
  { label: "Invoice #0423", value: "Paid" },
];

/* Beat 2 — the client portal */
const Portal: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FadeSlide delay={startFrame} from={20}>
          <div
            style={{
              fontFamily: instrumentSerif.fontFamily,
              fontSize: 92,
              lineHeight: 1.05,
              textAlign: "center",
              color: CHARCOAL,
              marginBottom: 44,
            }}
          >
            One link.
            <br />
            Not an inbox.
          </div>
        </FadeSlide>

        <FadeSlide delay={startFrame + 6} from={42}>
          <div
            style={{
              width: 820,
              maxWidth: "100%",
              background: CHARCOAL,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 44px 90px -30px rgba(28,28,28,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "20px 26px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ display: "flex", gap: 8 }}>
                <Dot c="#4E4A45" />
                <Dot c="#4E4A45" />
                <Dot c="#4E4A45" />
              </span>
              <span
                style={{
                  fontFamily: generalSansFamily,
                  fontWeight: 600,
                  fontSize: 26,
                  color: BEIGE,
                  marginLeft: 8,
                }}
              >
                idea-lab.uk/<span style={{ color: CLAY }}>clientloop</span>
              </span>
            </div>
            <div style={{ padding: "14px 34px 28px" }}>
              {PORTAL_ROWS.map((row, i) => {
                const opacity = interpolate(
                  local - 14 - i * 6,
                  [0, 10],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "22px 0",
                      borderBottom:
                        i < PORTAL_ROWS.length - 1
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "none",
                      opacity,
                      fontFamily: generalSansFamily,
                      fontSize: 30,
                    }}
                  >
                    <span style={{ color: "#B8B0A2" }}>{row.label}</span>
                    <span style={{ color: BEIGE, fontWeight: 600 }}>
                      {row.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeSlide>
      </div>
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
        fontSize: 38,
        color: CHARCOAL,
        opacity,
      }}
    >
      clientloop<span style={{ color: BRAND.accent }}>.</span>
    </div>
  );
};

export const Clientloop: React.FC<Props> = () => {
  const { durationInFrames } = useVideoConfig();
  const captions = useCaptions("voiceover/clientloop.json");
  const camera = useCameraDrift();

  // VO is short; split early so the portal beat has room to be read.
  const mid = Math.round(durationInFrames * 0.32);
  const endCardStart = durationInFrames - 60;

  const beat1 = useBeat(6, mid);
  const beat2 = useBeat(mid - 10, endCardStart);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg, fontFamily: generalSansFamily }}>
      <AmbientBackground brand={BRAND} />
      <Wordmark />

      <AbsoluteFill style={camera}>
        {beat1.visible ? (
          <AbsoluteFill style={{ opacity: beat1.opacity }}>
            <Chaos startFrame={8} />
          </AbsoluteFill>
        ) : null}
        {beat2.visible ? (
          <AbsoluteFill style={{ opacity: beat2.opacity }}>
            <Portal startFrame={mid - 10} />
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>

      <EndCard
        brand={BRAND}
        wordmark={
          <>
            clientloop<span style={{ color: BRAND.accent }}>.</span>
          </>
        }
        line="Everything a client needs, at one link."
        url="idea-lab.uk/clientloop"
        startAt={endCardStart}
        wordmarkFont={instrumentSerif.fontFamily}
        bodyFont={generalSansFamily}
      />

      <Grain brand={BRAND} id="clientloop" />

      <Sequence from={INTRO_FRAMES}>
        <Audio src={staticFile("voiceover/clientloop.mp3")} />
        {captions ? (
          <CaptionOverlay
            captions={captions}
            accentColor={BRAND.accent}
            baseColor={BRAND.muted}
            fontFamily={generalSansFamily}
          />
        ) : null}
      </Sequence>
    </AbsoluteFill>
  );
};
