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
  // David
  shiplog: "asDeXBMC8hUkhqqL7agO",
  saveflow: "asDeXBMC8hUkhqqL7agO",
  clientloop: "asDeXBMC8hUkhqqL7agO",
};
