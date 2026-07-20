import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPublicSans } from "@remotion/google-fonts/PublicSans";
import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";

export const spaceGrotesk = loadSpaceGrotesk("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

export const jetBrainsMono = loadJetBrainsMono("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

export const publicSans = loadPublicSans("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const playfairDisplay = loadPlayfairDisplay("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

export const manrope = loadManrope("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

export const instrumentSerif = loadInstrumentSerif("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// General Sans is a Fontshare font, not Google Fonts. Loaded via CSS in index.css instead.
export const generalSansFamily = "General Sans";
