import type { VideoCaptionCue } from "../shared/UnitVideoPlayer";
import trialMedia from "../generated/trialVideoMedia.json";

export interface UnitVideoData {
  unitId: string;
  title: string;
  scenarioTitle: string;
  src?: string;
  poster?: string;
  visualDescription: string;
  cues: VideoCaptionCue[];
  mediaReviewStatus: "approved" | "withheld";
}

/**
 * Trial video scenario data for Unit 1: Numbers & Counting.
 * Grounded in an authentic Pre-A1 adult interaction (ordering and counting at a cafe).
 */
export const NUMBERS_COUNTING_TRIAL_VIDEO: UnitVideoData = {
  // Preserved as review evidence. The scene uses unveiled women unnecessarily;
  // the user's image-selection preference requires a suitable replacement.
  mediaReviewStatus: "withheld",
  unitId: "numbers-counting",
  title: "Numbers & Counting in Action",
  scenarioTitle: "Morning Cafe Order (Table for Three)",
  src: trialMedia.video.url,
  poster: trialMedia.poster.url,
  visualDescription:
    "A clean, sunlit minimalist coffee shop. An adult customer steps up to a wooden counter. The barista greets them with a smile. The barista arranges coffee cups on a tray, placing one ceramic cup, then two, then three side by side. The customer gestures with their hands, taps to pay ten dollars, and picks up their order.",
  cues: [
    {
      id: "cue-1",
      startTime: 0.5,
      endTime: 3.2,
      speaker: "Barista",
      textEn: "Good morning! How many coffees would you like today?",
      textAr: "صباح الخير! كم فنجان قهوة تريد اليوم؟",
      keywords: ["how many"],
    },
    {
      id: "cue-2",
      startTime: 3.5,
      endTime: 7.2,
      speaker: "Customer",
      textEn: "Three coffees, please: one latte and two americanos.",
      textAr: "ثلاثة فناجين قهوة من فضلك: واحد لاتيه واثنان أمريكانو.",
      keywords: ["three", "one", "two"],
    },
    {
      id: "cue-3",
      startTime: 7.6,
      endTime: 10.8,
      speaker: "Barista",
      textEn: "Perfect! That is ten dollars in total, please.",
      textAr: "ممتاز! سيكون المجموع عشرة دولارات من فضلك.",
      keywords: ["ten"],
    },
    {
      id: "cue-4",
      startTime: 11.0,
      endTime: 14.5,
      speaker: "Customer",
      textEn: "Here you go, ten dollars. Thank you very much!",
      textAr: "تفضل، عشرة دولارات. شكراً جزيلاً!",
      keywords: ["ten"],
    },
  ],
};

export function getUnitVideo(unitId: string): UnitVideoData | undefined {
  if (
    unitId === "numbers-counting" &&
    NUMBERS_COUNTING_TRIAL_VIDEO.mediaReviewStatus === "approved"
  ) {
    return NUMBERS_COUNTING_TRIAL_VIDEO;
  }
  return undefined;
}
