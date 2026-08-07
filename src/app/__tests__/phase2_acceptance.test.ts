import { describe, expect, it } from "vitest";
import { updateStreak, getLocalDateString } from "../../features/gamification/streak";
import { screenToHash, hashToScreen } from "../router/useHashRouter";
import { getWordFallbackDataUrl } from "../shared/WordImage";
import { BEDROOM_VOCABULARY } from "../data/lessons";

describe("Phase 2 Acceptance Criteria Verification", () => {
  it("AC 1: Streak engine uses local calendar dates and prevents UTC midnight bugs", () => {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    
    // Initial active date
    const initial = updateStreak({ currentStreak: 0, lastActiveDate: null }, today);
    expect(initial.currentStreak).toBe(1);
    expect(initial.lastActiveDate).toBe(todayStr);

    // Same day call is idempotent
    const sameDay = updateStreak(initial, today);
    expect(sameDay.currentStreak).toBe(1);
  });

  it("AC 2: URL Hash router maps tabs to valid URLs and survives deep links", () => {
    expect(screenToHash({ id: "home" })).toEqual({ hash: "#/home", title: "WordPix — Home" });
    expect(screenToHash({ id: "explore" })).toEqual({ hash: "#/explore", title: "WordPix — Explore Worlds" });
    expect(screenToHash({ id: "profile" })).toEqual({ hash: "#/profile", title: "WordPix — Learner Profile" });

    expect(hashToScreen("#/home")).toEqual({ screen: { id: "home" }, title: "WordPix — Home" });
    expect(hashToScreen("#/profile")).toEqual({ screen: { id: "profile" }, title: "WordPix — Learner Profile" });
  });

  it("AC 3: Assessment-safe image fallback masks label text in assessment mode", () => {
    const sampleWord = BEDROOM_VOCABULARY[0];
    const learningFallback = getWordFallbackDataUrl(sampleWord, "learning");
    const assessmentFallback = getWordFallbackDataUrl(sampleWord, "assessment");

    expect(learningFallback).toContain(sampleWord.label);
    expect(assessmentFallback).not.toContain(sampleWord.label);
    expect(assessmentFallback).toContain("VISUAL%20OPTION");
  });
});
