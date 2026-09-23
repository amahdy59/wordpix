const HADITH_TITLES = [
  "Actions and Intentions",
  "Questions That Teach Religion",
  "The Five Pillars of Islam",
  "Creation, Life, and Human Actions",
  "Following Established Guidance",
  "Clear Choices and Doubtful Matters",
  "Sincere Advice and Respectful Communication",
  "Authority, Public Duties, and Accountability",
  "Following Guidance Within Our Ability",
  "Choosing What Is Lawful and Good",
  "Moving From Doubt to Clarity",
  "Focusing on What Concerns Us",
  "Wanting Good for Others",
  "The Sanctity of Life and Due Process",
  "Speaking Well and Welcoming Others",
  "Responding to Anger Wisely",
  "Excellence With Mercy",
  "Repairing a Mistake With Good",
  "Trust, Help, and Divine Decree",
  "Modesty as Moral Awareness",
  "Believe and Remain Steadfast",
  "Obligatory Practice and Paradise",
  "Purity, Patience, and Daily Choice",
  "Do Not Oppress One Another",
  "Many Forms of Charity",
  "Everyday Acts of Charity",
  "Character, Conscience, and Wrongdoing",
  "Farewell Counsel and Received Practice",
  "Paths of Good and Restraint of Speech",
  "Duties, Limits, and Silence",
  "Renouncing Possessions",
  "Neither Harm nor Return of Harm",
  "Claims, Proof, and Oaths",
  "Responding to Wrongdoing",
  "Respect, Fair Trade, and Protection",
  "Helping Others and Seeking Knowledge",
  "Intentions and Recorded Deeds",
  "Drawing Near Through Worship",
  "Mistakes, Forgetfulness, and Duress",
  "A Traveler in This World",
  "Guiding Desires by Revelation",
  "Hope, Prayer, and Forgiveness",
] as const;

export const HADITH_LESSON_COUNT = HADITH_TITLES.length;

export function getHadithLessonMetadata(number: number) {
  const title = HADITH_TITLES[number - 1];
  return title
    ? {
        id: `hadith-${String(number).padStart(2, "0")}`,
        number,
        title,
      }
    : undefined;
}
