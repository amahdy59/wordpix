/** Individually reviewed Hadith vocabulary references; never infer images by term similarity. */
interface ReviewedVocabularyMedia {
  contentId: string;
  contentSha256: string;
  image480: string;
  image960: string;
  alt: string;
}

const media: Readonly<Record<string, ReviewedVocabularyMedia>> = {
  "3/establish the daily prayers": {
    contentId: "coverage-28da4039c0bc3dbaff5edaa5",
    contentSha256: "28da4039c0bc3dbaff5edaa59a1e09d276d533e08b6e3631aceb5a9bd6265b85",
    image480:
      "question-images/v2/hadith-reviewed-media/d268252458478abdeebfc0dc12099eb57742dc93e60047aaf2c57958eac0e73a.webp",
    image960:
      "question-images/v2/hadith-reviewed-media/ccef6747fc5665837afabae691d75b2aceb6b2f735eb5a255c269c3e49eb5fcd.webp",
    alt: "An adult stands on a carpet in a mosque with his hands folded in front of his chest.",
  },
  "3/perform Hajj or go on pilgrimage": {
    contentId: "coverage-234632e8b0c5bb6e7908ccbb",
    contentSha256: "234632e8b0c5bb6e7908ccbbdef8cc3a7cb4ee6cb15c20ce5078281c78ec13e9",
    image480:
      "question-images/v2/hadith-reviewed-media/c2783eec16f66a4d07f52947c7aab3311efac8f72d803fd15272ae08cda92b78.webp",
    image960:
      "question-images/v2/hadith-reviewed-media/77bf650363d0377aa6def15baa17d09203b0fd84e81295f5e49a44b591086e3e.webp",
    alt: "An adult in white pilgrimage clothing stands in a mosque courtyard, with the Kaaba behind him.",
  },
  "26/joint": {
    contentId: "coverage-6047733e72c39420020683e2",
    contentSha256: "6047733e72c39420020683e26191240a2d6c7e88bd744e08ecd9478f8c3050e0",
    image480:
      "question-images/v2/hadith-reviewed-media/e3c6c18a22f71d9c355fc9085494619f5189dec354b279bc0302a21f55877499.webp",
    image960:
      "question-images/v2/hadith-reviewed-media/3413e64fc902ae9a80e90952f1dc7a36fae500797f4691c34d55dc1836c938ba.webp",
    alt: "A simplified knee diagram shows the connection between the upper and lower leg bones, with a small round bone at the front.",
  },
};

export function getReviewedHadithVocabularyMedia(lessonNumber: number | undefined, term: string) {
  if (!lessonNumber) return undefined;
  return media[`${lessonNumber}/${term}`];
}

export const REVIEWED_HADITH_VOCABULARY_MEDIA = media;
