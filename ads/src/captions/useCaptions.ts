import { useCallback, useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";
import type { Caption } from "@remotion/captions";

export const useCaptions = (file: string) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender(`loading captions: ${file}`));

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile(file));
      const data = (await response.json()) as Caption[];
      setCaptions(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e as Error);
    }
  }, [file, continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  return captions;
};
