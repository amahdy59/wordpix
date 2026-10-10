export interface DiscussionPrompt {
  id: string;
  prompt: string;
}

export interface DiscussionPromptGroup<T extends DiscussionPrompt> {
  question: T;
  guidance: T[];
}

/** Presentation only: retain original IDs and text, and keep leading guidance. */
export function groupDiscussionPrompts<T extends DiscussionPrompt>(
  prompts: readonly T[]
): DiscussionPromptGroup<T>[] {
  const groups: DiscussionPromptGroup<T>[] = [];
  for (const prompt of prompts) {
    const previous = groups.at(-1);
    if (
      previous &&
      /^(?:answer|reason|(?:service\s+)?example)\s*(?:→|:)/i.test(prompt.prompt.trim())
    ) {
      previous.guidance.push(prompt);
    } else {
      groups.push({ question: prompt, guidance: [] });
    }
  }
  return groups;
}
