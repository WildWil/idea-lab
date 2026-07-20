import { writeFileSync, mkdirSync } from "node:fs";
import { VOICEOVER_LINES, VOICE_IDS, type ClipId } from "../src/lines";

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("Missing ELEVENLABS_API_KEY in the environment.");
  process.exit(1);
}

function charsToWordCaptions(alignment: Alignment): Caption[] {
  const captions: Caption[] = [];
  let word = "";
  let wordStart: number | null = null;
  let wordEnd = 0;
  let isFirstWord = true;

  const flush = () => {
    if (word.length === 0) return;
    captions.push({
      // Leading space on every word after the first: @remotion/captions is
      // whitespace-sensitive and needs the space in the text itself to wrap
      // and space words correctly, it won't insert one for you.
      text: isFirstWord ? word : ` ${word}`,
      startMs: Math.round((wordStart ?? 0) * 1000),
      endMs: Math.round(wordEnd * 1000),
      timestampMs: null,
      confidence: null,
    });
    isFirstWord = false;
    word = "";
    wordStart = null;
  };

  alignment.characters.forEach((char, i) => {
    if (char === " ") {
      flush();
      return;
    }
    if (wordStart === null) {
      wordStart = alignment.character_start_times_seconds[i];
    }
    wordEnd = alignment.character_end_times_seconds[i];
    word += char;
  });
  flush();

  return captions;
}

async function generateOne(id: ClipId) {
  const text = VOICEOVER_LINES[id];
  const voiceId = VOICE_IDS[id];

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          // Higher stability + lower style = calmer, more even delivery.
          // The default (0.5 / 0.3) read as jumpy/erratic on the first pass.
          stability: 0.8,
          similarity_boost: 0.75,
          style: 0.1,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs request failed for ${id}: ${response.status} ${body}`);
  }

  const data = (await response.json()) as {
    audio_base64: string;
    alignment: Alignment;
  };

  mkdirSync("public/voiceover", { recursive: true });

  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  writeFileSync(`public/voiceover/${id}.mp3`, audioBuffer);

  const captions = charsToWordCaptions(data.alignment);
  writeFileSync(
    `public/voiceover/${id}.json`,
    JSON.stringify(captions, null, 2),
  );

  console.log(`${id}: wrote public/voiceover/${id}.mp3 and ${id}.json (${captions.length} words)`);
}

async function main() {
  const ids = Object.keys(VOICEOVER_LINES) as ClipId[];
  for (const id of ids) {
    await generateOne(id);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
