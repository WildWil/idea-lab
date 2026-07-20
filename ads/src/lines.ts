export type ClipId = "shiplog" | "saveflow" | "clientloop";

export const VOICEOVER_LINES: Record<ClipId, string> = {
  shiplog:
    "Your commits already tell the story. Shiplog turns them into a changelog people actually read.",
  saveflow:
    "Card declined? Customer gone. Saveflow gets them back before you even notice.",
  clientloop:
    "Stop managing clients over email. Give them one link instead.",
};

export const VOICE_IDS: Record<ClipId, string> = {
  // Default to the same ElevenLabs voice for all three; override per-clip if you want variety.
  shiplog: "21m00Tcm4TlvDq8ikWAM",
  saveflow: "21m00Tcm4TlvDq8ikWAM",
  clientloop: "21m00Tcm4TlvDq8ikWAM",
};
