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
  // "Adam", a calm male ElevenLabs premade voice. Override per-clip if you want variety.
  shiplog: "pNInz6obpgDQGcFmaJgB",
  saveflow: "pNInz6obpgDQGcFmaJgB",
  clientloop: "pNInz6obpgDQGcFmaJgB",
};
