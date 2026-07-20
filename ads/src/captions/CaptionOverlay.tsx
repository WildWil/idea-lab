import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption } from "@remotion/captions";

const SWITCH_CAPTIONS_EVERY_MS = 900;

type Props = {
  readonly captions: Caption[];
  readonly accentColor: string;
  readonly baseColor: string;
  readonly fontFamily: string;
};

export const CaptionOverlay: React.FC<Props> = ({
  captions,
  accentColor,
  baseColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      }),
    [captions],
  );

  const page = pages.find(
    (p, i) =>
      currentMs >= p.startMs &&
      (pages[i + 1] ? currentMs < pages[i + 1].startMs : true),
  );

  if (!page) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 160,
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.25,
          textAlign: "center",
          whiteSpace: "pre-wrap",
        }}
      >
        {page.tokens.map((token) => {
          const isActive = token.fromMs <= currentMs && token.toMs > currentMs;
          return (
            <span
              key={token.fromMs}
              style={{ color: isActive ? accentColor : baseColor }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
