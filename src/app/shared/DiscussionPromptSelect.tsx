import { useId } from "react";
import { useI18n } from "../../i18n";

export function DiscussionPromptSelect({
  prompts,
  selectedIndex,
  onSelect,
}: {
  prompts: readonly { id: string | number; prompt: string }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const { t } = useI18n();
  const id = useId();
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="block text-base font-bold text-foreground">
        {t("conversation.chooseSpeakingPrompt")}
      </label>
      <select
        id={id}
        value={selectedIndex}
        onChange={(event) => onSelect(Number(event.target.value))}
        className="min-h-11 w-full min-w-0 rounded-xl border bg-card px-3 py-2 text-base text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {prompts.map((prompt, index) => (
          <option key={prompt.id} value={index}>
            {index + 1}. {prompt.prompt}
          </option>
        ))}
      </select>
    </div>
  );
}
