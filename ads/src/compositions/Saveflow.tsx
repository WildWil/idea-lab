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
  bg: "#FAF9F6",
  ink: "#11233F",
  muted: "#5B6B7E",
  accent: "#7D5F26",
  glow: "rgba(185,151,74,0.22)",
  glowX: 82,
  glowY: -6,
  glowSpread: 70,
  vignette: "rgba(17,35,63,0.07)",
  grainOpacity: 0.05,
  grainBlend: "soft-light",
};

const GOLD = "#7D5F26";
const RED = "#B3452F";
const CARD = "#FFFFFF";
const LINE = "#E6E2D8";

const FPS = 30;
const INTRO_FRAMES = 9;
const OUTRO_FRAMES = 66;
const TICKER_TARGET = 4280;

type Props = { readonly audioDurationInFrames: number };

export const saveflowMetadata: CalculateMetadataFunction<Props> = async () => {
  const seconds = await getAudioDuration(staticFile("voiceover/saveflow.mp3"));
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
            fontFamily: manrope.fontFamily,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: RED,
            marginBottom: 28,
          }}
        >
          Failed payment
        </div>
      </FadeSlide>
      <div
        style={{
          fontFamily: playfairDisplay.fontFamily,
          fontWeight: 600,
          fontSize: 104,
          lineHeight: 1.06,
          letterSpacing: "-0.01em",
          color: BRAND.ink,
        }}
      >
        <RiseIn delay={10} blur>
          Card declined.
        </RiseIn>
        <RiseIn delay={20} blur>
          Customer gone.
        </RiseIn>
      </div>
    </AbsoluteFill>
  );
};

type Row = { date: string; plan: string; flips?: boolean; recovered?: boolean };
const ROWS: Row[] = [
  { date: "Jul 14", plan: "$129/mo", flips: true },
  { date: "Jul 11", plan: "$49/mo", recovered: true },
  { date: "Jul 6", plan: "$49/mo", recovered: true },
];

/* Beat 2 — the recovery ledger */
const Product: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const p = spring({ frame: local - 6, fps, config: { damping: 26, mass: 1.3 } });
  const value = Math.round(interpolate(p, [0, 1], [0, TICKER_TARGET]));

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
            border: `1px solid ${LINE}`,
            borderRadius: 20,
            padding: "44px 46px",
            boxShadow: "0 40px 90px -34px rgba(17,35,63,0.28)",
          }}
        >
          <div
            style={{
              fontFamily: manrope.fontFamily,
              fontWeight: 700,
              fontSize: 118,
              color: GOLD,
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
              fontSize: 30,
              color: BRAND.muted,
              marginTop: 12,
              marginBottom: 34,
            }}
          >
            recovered automatically, this month
          </div>
          <div
            style={{ borderTop: `1px dashed ${LINE}`, paddingTop: 26, display: "grid", gap: 20 }}
          >
            {ROWS.map((row, i) => (
              <LedgerRow key={i} row={row} local={local} index={i} />
            ))}
          </div>
        </div>
      </FadeSlide>
    </AbsoluteFill>
  );
};

const LedgerRow: React.FC<{ row: Row; local: number; index: number }> = ({
  row,
  local,
  index,
}) => {
  const appear = interpolate(local - 16 - index * 7, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flipAt = 44;
  const flip = row.flips
    ? interpolate(local, [flipAt, flipAt + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : row.recovered
      ? 1
      : 0;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        opacity: appear,
        fontFamily: manrope.fontFamily,
        fontSize: 27,
        color: BRAND.ink,
      }}
    >
      <span>
        {row.date} &middot; {row.plan} declined
      </span>
      <span style={{ position: "relative", minWidth: 220, height: 46 }}>
        <Badge kind="declined" opacity={1 - flip} />
        <Badge kind="recovered" opacity={flip} />
      </span>
    </div>
  );
};

const Badge: React.FC<{ kind: "declined" | "recovered"; opacity: number }> = ({
  kind,
  opacity,
}) => {
  const recovered = kind === "recovered";
  return (
    <span
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        opacity,
        fontFamily: manrope.fontFamily,
        fontWeight: 600,
        fontSize: 24,
        padding: "10px 20px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        color: recovered ? GOLD : RED,
        background: recovered ? "rgba(125,95,38,0.12)" : "rgba(179,69,47,0.10)",
      }}
    >
      {recovered ? "recovered ✓" : "retrying…"}
    </span>
  );
};

export const Saveflow: React.FC<Props> = () => {
  const { durationInFrames } = useVideoConfig();
  const captions = useCaptions("voiceover/saveflow.json");

  const mid = Math.round(durationInFrames * 0.38);
  const endCardStart = durationInFrames - 60;

  const beat1 = useBeat(6, mid);
  const beat2 = useBeat(mid - 10, endCardStart);
  const camera = useCameraDrift();

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg, fontFamily: manrope.fontFamily }}>
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
            saveflow<span style={{ color: GOLD }}>.</span>
          </>
        }
        line="Stop losing customers to failed payments."
        url="idea-lab.uk/saveflow"
        startAt={endCardStart}
        wordmarkFont={playfairDisplay.fontFamily}
        bodyFont={manrope.fontFamily}
      />

      <Grain brand={BRAND} id="saveflow" />

      <Sequence from={INTRO_FRAMES}>
        <Audio src={staticFile("voiceover/saveflow.mp3")} />
        {captions ? (
          <CaptionOverlay
            captions={captions}
            accentColor={GOLD}
            baseColor={BRAND.muted}
            fontFamily={manrope.fontFamily}
          />
        ) : null}
      </Sequence>
    </AbsoluteFill>
  );
};
